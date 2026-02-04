const URL =
  "https://script.google.com/macros/s/AKfycbxL5FNQn80V2FPXqbtX3sLfkCX7Piy_Ozpfv7FH4AKfQvXoRJjS1gBdVxV9WCBbRsSEyA/exec";

/* ================================
   MASTER DATA BLOK
   ================================ */
const SEMUA_BLOK = [
  "1A",
  "2A",
  "3A",
  "4A",
  "5A",
  "6A",
  "7A",
  "8A",
  "9A",
  "10A",
  "11A",
  "12A",
  "13A",
  "14A",
  "15A",
  "16A",
  "17A",
  "18A",
  "19A",
  "20A",
  "1B",
  "2B",
  "3B",
  "4B",
  "5B",
  "6B",
  "7B",
  "8B",
  "9B",
  "10B",
  "11B",
  "12B",
  "13B",
  "14B",
  "15B",
  "16B",
  "17B",
  "18B",
  "19B",
  "20B",
];

/* ================================
   UBAH FORM
   ================================ */
function ubahForm() {
  formBeli.classList.add("hidden");
  formJual.classList.add("hidden");
  formTetap.classList.add("hidden");
  formVariabel.classList.add("hidden");

  if (sheet.value === "Beli sapi") {
    formBeli.classList.remove("hidden");
    loadBlok("Beli sapi", "posisi");
  }

  if (sheet.value === "Jual sapi") {
    formJual.classList.remove("hidden");
    loadBlok("Jual sapi", "posisiJual");
  }

  if (sheet.value === "Biaya Tetap") formTetap.classList.remove("hidden");
  if (sheet.value === "Biaya variabel") formVariabel.classList.remove("hidden");
}

/* ================================
   LOAD BLOK SESUAI SHEET
   ================================ */
function loadBlok(sheetName, selectId) {
  fetch(URL + "?action=posisi&sheet=" + encodeURIComponent(sheetName))
    .then((res) => res.json())
    .then((terpakai) => {
      const select = document.getElementById(selectId);
      if (!select) return;

      select.innerHTML = `<option value="">-- Pilih Blok --</option>`;

      SEMUA_BLOK.forEach((blok) => {
        if (!terpakai.includes(blok)) {
          const opt = document.createElement("option");
          opt.value = blok;
          opt.textContent = blok;
          select.appendChild(opt);
        }
      });
    });
}

/* ================================
   KIRIM DATA
   ================================ */
function kirim() {
  if (!sheet.value) return alert("Pilih jenis data dulu");

  let data = { sheet: sheet.value };

  if (sheet.value === "Beli sapi") {
    if (!posisi.value) return alert("Pilih blok");
    data.posisi = posisi.value;
    data.harga = hargaBeli.value;
    data.tanggalbeli = tanggalbeli.value;
  }

  if (sheet.value === "Jual sapi") {
    if (!posisiJual.value) return alert("Pilih blok");
    data.posisiJual = posisiJual.value;
    data.Jual = hargaJual.value;
    data.tanggaljual = tanggaljual.value;
  }

  if (sheet.value === "Biaya Tetap") {
    data.nama = namaTetap.value;
    data.jumlah = Number(JumlahTetap.value);
    data.beras = Number(Beras.value);
    data.tanggaltetap = tanggaltetap.value;
  }

  if (sheet.value === "Biaya variabel") {
    data.barang = barang.value;
    data.jumlah = jumlahVar.value;
    data.harga = hargaVar.value;
    data.tanggalvar = tanggalvar.value;
  }

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
  }).then(() => {
    alert("Data berhasil disimpan");
    location.reload();
  });
}

/* ================================
   AUTO TANGGAL HARI INI
   ================================ */
document.querySelectorAll(".auto-tanggal").forEach((el) => {
  el.value = new Date().toISOString().split("T")[0];
});

/* ================================
   FORMAT RUPIAH
   ================================ */
function formatRupiah(input) {
  let angka = input.value.replace(/\D/g, "");
  input.value = angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
