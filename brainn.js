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
   UTIL
   ================================ */
const bersih = (v) => (v ? v.toString().replace(/\D/g, "") : "");

/* ================================
   LOADING PROGRESS (0–100%)
   ================================ */
let progress = 0;

function setProgress(val) {
  const bar = document.querySelector(".loading-progress");
  if (!bar) return;
  bar.style.width = val + "%";
}

/* ================================
   BUKA APP
   ================================ */
function openApp() {
  const loading = document.getElementById("loading-screen");
  const app = document.getElementById("app");

  if (loading) loading.style.display = "none";
  if (app) app.style.display = "block";
}

/* ================================
   INIT LOADING
   ================================ */
document.addEventListener("DOMContentLoaded", () => {
  // cek online
  if (!navigator.onLine) {
    alert("Aplikasi harus ONLINE");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll(".auto-tanggal").forEach((el) => {
    el.value = today;
  });

  // simulasi progress stabil
  const interval = setInterval(() => {
    progress += 10;
    setProgress(progress);

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(openApp, 300);
    }
  }, 150);
});

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
   LOAD BLOK (ONLINE ONLY)
   ================================ */
function loadBlok(sheetName, selectId) {
  if (!navigator.onLine) return;

  fetch(URL + "?action=posisi&sheet=" + encodeURIComponent(sheetName))
    .then((r) => r.json())
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
   KIRIM DATA (ONLINE ONLY)
   ================================ */
function kirim() {
  if (!navigator.onLine) {
    alert("Aplikasi harus ONLINE");
    return;
  }

  if (!sheet.value) {
    alert("Pilih jenis data dulu");
    return;
  }

  let data = { sheet: sheet.value };

  if (sheet.value === "Beli sapi") {
    if (!posisi.value) return alert("Pilih blok");
    data.posisi = posisi.value;
    data.harga = bersih(hargaBeli.value);
    data.tanggalbeli = tanggalbeli.value;
  }

  if (sheet.value === "Jual sapi") {
    if (!posisiJual.value) return alert("Pilih blok");
    data.posisiJual = posisiJual.value;
    data.Jual = bersih(hargaJual.value);
    data.tanggaljual = tanggaljual.value;
  }

  if (sheet.value === "Biaya Tetap") {
    data.nama = namaTetap.value;
    data.jumlah = bersih(JumlahTetap.value);
    data.beras = bersih(Beras.value);
    data.tanggaltetap = tanggaltetap.value;
  }

  if (sheet.value === "Biaya variabel") {
    data.barang = barang.value;
    data.jumlah = bersih(jumlahVar.value);
    data.harga = bersih(hargaVar.value);
    data.tanggalvar = tanggalvar.value;
  }

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(() => {
      alert("Data berhasil disimpan");
      resetFormAktif();
    })
    .catch(() => alert("Gagal menyimpan data"));
}

/* ================================
   RESET FORM
   ================================ */
function resetFormAktif() {
  const today = new Date().toISOString().split("T")[0];

  document.querySelectorAll(".uang").forEach((i) => (i.value = ""));
  document.querySelectorAll(".auto-tanggal").forEach((i) => (i.value = today));

  if (sheet.value === "Beli sapi") loadBlok("Beli sapi", "posisi");
  if (sheet.value === "Jual sapi") loadBlok("Jual sapi", "posisiJual");
}

/* ================================
   FORMAT RIBUAN
   ================================ */
document.addEventListener("input", (e) => {
  if (!e.target.classList.contains("uang")) return;
  const angka = e.target.value.replace(/\D/g, "");
  e.target.value = angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

/* ================================
   SERVICE WORKER
   ================================ */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

/* =================================
   AUTO RELOAD SAAT KONEKSI BALIK
   ================================= */

// kalau offline → kasih tanda di console (opsional)
window.addEventListener("offline", () => {
  console.warn("Offline — menunggu koneksi kembali…");
});

// kalau online lagi → reload otomatis
window.addEventListener("online", () => {
  console.log("Online kembali — reload aplikasi");
  location.reload();
});
