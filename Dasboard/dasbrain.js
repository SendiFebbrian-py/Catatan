/* ===============================
   KONFIGURASI
   =============================== */
const API_URL =
  "https://script.google.com/macros/s/AKfycbxL5FNQn80V2FPXqbtX3sLfkCX7Piy_Ozpfv7FH4AKfQvXoRJjS1gBdVxV9WCBbRsSEyA/exec";

const TOKEN = "Sendi_Banjar";
const SHEET_TERKUNCI = ["Harga di peroleh"];

let dataAll = {};
let DATA_HASH = "";

/* ===============================
   LOAD & AUTO SYNC DATA
   =============================== */
function hashData(data) {
  return JSON.stringify(data).length;
}

function loadData() {
  fetch(API_URL + "?token=" + TOKEN)
    .then((res) => res.json())
    .then((data) => {
      console.log("DATA:", data);
      console.log("DATA TETAP:", data.tetap); // 🔥 debug

      const newHash = hashData(data);
      if (newHash !== DATA_HASH) {
        DATA_HASH = newHash;
        dataAll = data;
        renderAll();
      }
    })
    .catch((err) => console.error("LOAD ERROR:", err));
}

loadData();
setInterval(loadData, 10000);

/* ===============================
   RENDER SEMUA
   =============================== */
function renderAll() {
  renderTable("penjualan", dataAll.penjualan);
  renderTable("pembelian", dataAll.pembelian);
  renderTable("variabel", dataAll.variabel);
  renderTable("tetap", dataAll.tetap);
  renderTable("peroleh", dataAll.peroleh);

  renderStatistik();
  renderChart();
}

/* ===============================
   HELPER AMBIL ANGKA (ANTI Rp)
   =============================== */
function ambilAngka(val) {
  if (!val) return 0;
  return Number(val.toString().replace(/[^\d]/g, "")) || 0;
}

/* ===============================
   STATISTIK
   =============================== */
function renderStatistik() {
  let totalBeli = 0;
  let totalUntung = 0;

  (dataAll.pembelian || []).forEach((d) => {
    totalBeli += ambilAngka(d.harga ?? d["harga beli"]);
  });

  (dataAll.penjualan || []).forEach((d) => {
    totalUntung += ambilAngka(d.keuntungan);
  });

  document.getElementById("totalBeli").textContent = formatRupiah(totalBeli);
  document.getElementById("totalUntung").textContent =
    formatRupiah(totalUntung);
}

/* ===============================
   CHART
   =============================== */
function renderChart() {
  const pembelian = (dataAll.pembelian || []).reduce(
    (a, d) => a + ambilAngka(d.harga ?? d["harga beli"]),
    0,
  );

  const variabel = (dataAll.variabel || []).reduce(
    (a, d) => a + ambilAngka(d["harga total"]),
    0,
  );

  const tetap = (dataAll.tetap || []).reduce((total, d) => {
    return total + ambilAngka(d.jumlah);
  }, 0);

  const totalSemua = pembelian + variabel + tetap;

  drawPie(
    "chartBreakdown",
    [pembelian, variabel, tetap],
    ["#3b82f6", "#f59e0b", "#ef4444"],
    ["Pembelian sapi", "Pakan & DLL", "Gaji"],
  );

  renderLegend(
    "legendBreakdown",
    ["Pembelian sapi", "Pakan & DLL", "Gaji"],
    [pembelian, variabel, tetap],
    ["#3b82f6", "#f59e0b", "#ef4444"],
  );

  drawPie("chartTotal", [totalSemua], ["#10b981"], ["TOTAL"]);
  document.getElementById("totalText").textContent = formatRupiah(totalSemua);
}

/* ===============================
   DRAW PIE
   =============================== */
function drawPie(canvasId, data, colors, labels) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const total = data.reduce((a, b) => a + b, 0);
  if (total === 0) return;

  let start = 0;

  data.forEach((val, i) => {
    const slice = (val / total) * 2 * Math.PI;

    // skip kalau benar-benar kosong
    if (val === 0) {
      start += slice;
      return;
    }

    // ===============================
    // 🎨 GAMBAR PIE (SELALU DIGAMBAR)
    // ===============================
    ctx.beginPath();
    ctx.moveTo(110, 110);
    ctx.arc(110, 110, 100, start, start + slice);
    ctx.fillStyle = colors[i];
    ctx.fill();

    start += slice;
  });
}

function renderLegend(containerId, labels, data, colors) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  labels.forEach((label, i) => {
    if (!data[i]) return;

    const item = document.createElement("div");
    item.className = "legend-item";

    const color = document.createElement("div");
    color.className = "legend-color";
    color.style.background = colors[i];

    const text = document.createElement("span");
    text.textContent = `${label} - ${formatRupiah(data[i])}`;

    item.appendChild(color);
    item.appendChild(text);
    container.appendChild(item);
  });
}

/* ===============================
   TABLE
   =============================== */
function renderTable(id, data) {
  const table = document.querySelector(`#${id} table`);
  if (!table || !data || !data.length) {
    if (table) table.innerHTML = "";
    return;
  }

  const headers = Object.keys(data[0]);
  const sheetName = mapSheet(id);
  const terkunci = SHEET_TERKUNCI.includes(sheetName);

  let html = "<thead><tr>";

  if (!terkunci) {
    html += `<th><input type="checkbox" id="checkAll-${id}"></th>`;
  }

  html += headers.map((h) => `<th>${h.toUpperCase()}</th>`).join("");
  html += "</tr></thead><tbody>";

  data.forEach((row, index) => {
    html += "<tr>";

    if (!terkunci) {
      html += `<td><input type="checkbox" class="row-check"
        data-row="${index + 2}" data-sheet="${id}"></td>`;
    }

    html += headers
      .map((h) => {
        let val = row[h];

        if (h.toLowerCase().includes("tanggal")) {
          val = formatTanggal(val);
        }

        if (
          typeof val === "number" &&
          /(harga|total|biaya|keuntungan|jumlah)/i.test(h)
        ) {
          val = formatRupiah(val);
        } else if (typeof val === "number") {
          val = Number(val).toLocaleString("id-ID");
        }

        return `<td>${val ?? ""}</td>`;
      })
      .join("");

    html += "</tr>";
  });

  html += "</tbody>";
  table.innerHTML = html;

  if (!terkunci) pasangCheckboxEvent(id);
}

/* ===============================
   CHECKBOX
   =============================== */
function pasangCheckboxEvent(id) {
  const checkAll = document.getElementById(`checkAll-${id}`);
  const checks = document.querySelectorAll(`.row-check[data-sheet="${id}"]`);
  const btn = document.getElementById(`hapus${capitalize(id)}`);

  if (checkAll) {
    checkAll.onchange = () => {
      checks.forEach((c) => (c.checked = checkAll.checked));
      toggleBtn();
    };
  }

  checks.forEach((c) => (c.onchange = toggleBtn));

  function toggleBtn() {
    const ada = [...checks].some((c) => c.checked);
    if (btn) btn.classList.toggle("hidden", !ada);
  }
}

/* ===============================
   HAPUS
   =============================== */
function hapusTerpilih(id) {
  const sheet = mapSheet(id);

  if (SHEET_TERKUNCI.includes(sheet)) {
    alert("Data ini terkunci");
    return;
  }

  const rows = [
    ...document.querySelectorAll(`.row-check[data-sheet="${id}"]:checked`),
  ]
    .map((c) => Number(c.dataset.row))
    .sort((a, b) => b - a);

  if (!rows.length) return alert("Pilih data dulu");
  if (!confirm(`Yakin hapus ${rows.length} data?`)) return;

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "hapusBanyak",
      sheet,
      rows,
      token: TOKEN,
    }),
  }).then(() => loadData());
}

/* ===============================
   UI
   =============================== */
function show(id) {
  document
    .querySelectorAll(".card")
    .forEach((c) => c.classList.remove("active"));

  document.getElementById(id)?.classList.add("active");
}

function cari(input) {
  const q = input.value.toLowerCase();
  const table = document.querySelector(".card.active table");
  if (!table) return;

  table.querySelectorAll("tbody tr").forEach((tr) => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? "" : "none";
  });
}

/* ===============================
   UTIL
   =============================== */
function formatRupiah(num) {
  return "Rp " + Number(num).toLocaleString("id-ID");
}

function formatTanggal(value) {
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString("id-ID");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function mapSheet(id) {
  return {
    penjualan: "Jual sapi",
    pembelian: "Beli sapi",
    variabel: "Biaya variabel",
    tetap: "Biaya Tetap",
    peroleh: "Harga di peroleh",
  }[id];
}
