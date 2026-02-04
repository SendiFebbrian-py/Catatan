/* ===============================
   KONFIGURASI
   =============================== */
const API_URL =
  "https://script.google.com/macros/s/AKfycbxL5FNQn80V2FPXqbtX3sLfkCX7Piy_Ozpfv7FH4AKfQvXoRJjS1gBdVxV9WCBbRsSEyA/exec";

const SHEET_TERKUNCI = ["Harga di peroleh"]; // ❌ tidak boleh dihapus

let dataAll = {};

/* ===============================
   LOAD DATA
   =============================== */
fetch(API_URL)
  .then((res) => res.json())
  .then((data) => {
    dataAll = data;
    renderAll();
  });

function renderAll() {
  renderTable("penjualan", dataAll.penjualan);
  renderTable("pembelian", dataAll.pembelian);
  renderTable("variabel", dataAll.variabel);
  renderTable("tetap", dataAll.tetap);
  renderTable("peroleh", dataAll.peroleh);
}

/* ===============================
   RENDER TABLE (TANPA AKSI KANAN)
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

  // checkbox hanya jika tidak terkunci
  if (!terkunci) {
    html += `<th><input type="checkbox" id="checkAll-${id}"></th>`;
  }

  html += headers.map((h) => `<th>${h}</th>`).join("");
  html += "</tr></thead><tbody>";

  data.forEach((row, index) => {
    html += "<tr>";

    if (!terkunci) {
      html += `
        <td>
          <input type="checkbox"
            class="row-check"
            data-row="${index + 2}"
            data-sheet="${id}">
        </td>`;
    }

    html += headers
      .map((h) => {
        let val = row[h];

        if (h.toLowerCase().includes("tanggal")) {
          val = formatTanggal(val);
        }

        if (
          typeof val === "number" &&
          /(harga|jumlah|biaya|keuntungan)/i.test(h)
        ) {
          val = formatRupiah(val);
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
   CHECKBOX + TOMBOL HAPUS TERPILIH
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
   HAPUS TERPILIH (SATU-SATUNYA)
   =============================== */
function hapusTerpilih(id) {
  const sheet = mapSheet(id);

  if (SHEET_TERKUNCI.includes(sheet)) {
    alert("Data ini terkunci dan tidak bisa dihapus");
    return;
  }

  const rows = [
    ...document.querySelectorAll(`.row-check[data-sheet="${id}"]:checked`),
  ]
    .map((c) => Number(c.dataset.row))
    .sort((a, b) => b - a);

  if (!rows.length) {
    alert("Pilih data yang mau dihapus dulu");
    return;
  }

  if (!confirm(`Yakin hapus ${rows.length} data?`)) return;

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "hapusBanyak",
      sheet,
      rows,
    }),
  }).then(() => {
    location.reload();
  });
}

/* ===============================
   UI & UTIL
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

function formatRupiah(num) {
  return "Rp " + Number(num).toLocaleString("id-ID");
}

function formatTanggal(value) {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const d = new Date(value);
  if (isNaN(d)) return value;
  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
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
