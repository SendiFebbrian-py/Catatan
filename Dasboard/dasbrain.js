const API_URL =
  "https://script.google.com/macros/s/AKfycbxL5FNQn80V2FPXqbtX3sLfkCX7Piy_Ozpfv7FH4AKfQvXoRJjS1gBdVxV9WCBbRsSEyA/exec";

let dataAll = {};

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

function renderTable(id, data) {
  const table = document.querySelector(`#${id} table`);
  if (!table) return;

  if (!data || !data.length) {
    table.innerHTML = "";
    return;
  }

  const headers = Object.keys(data[0]);

  let html = "<tr>" + headers.map((h) => `<th>${h}</th>`).join("") + "</tr>";

  data.forEach((row) => {
    html +=
      "<tr>" +
      headers
        .map((h) => {
          let val = row[h];

          // FORMAT TANGGAL
          if (h.toLowerCase().includes("tanggal")) {
            val = formatTanggal(val);
          }

          // FORMAT RUPIAH
          if (
            typeof val === "number" &&
            (h.toLowerCase().includes("harga") ||
              h.toLowerCase().includes("jumlah") ||
              h.toLowerCase().includes("keuntungan") ||
              h.toLowerCase().includes("biaya"))
          ) {
            val = formatRupiah(val);
          }

          return `<td>${val ?? ""}</td>`;
        })
        .join("") +
      "</tr>";
  });

  table.innerHTML = html;
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

// Tampilkan card yang dipilih dari menu
function show(id) {
  document
    .querySelectorAll(".card")
    .forEach((c) => c.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

// Cari di tabel pada card aktif
function cari(input) {
  const q = (input.value || "").trim().toLowerCase();
  const active = document.querySelector(".card.active");
  if (!active) return;
  const table = active.querySelector("table");
  if (!table) return;
  const rows = table.querySelectorAll("tr");
  rows.forEach((tr, i) => {
    if (i === 0) return; // header
    const text = tr.textContent.toLowerCase();
    tr.style.display = q ? (text.includes(q) ? "" : "none") : "";
  });
}
