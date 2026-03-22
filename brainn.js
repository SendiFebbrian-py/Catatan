const URL =
  "https://script.google.com/macros/s/AKfycbxL5FNQn80V2FPXqbtX3sLfkCX7Piy_Ozpfv7FH4AKfQvXoRJjS1gBdVxV9WCBbRsSEyA/exec";

const TOKEN = "Sendi_Banjar";

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
   SESSION TIMER
   ================================ */
let timeout;

function startSessionTimer() {
  resetTimer();
  document.addEventListener("mousemove", resetTimer);
  document.addEventListener("keydown", resetTimer);
  document.addEventListener("click", resetTimer);
}

function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(
    () => {
      alert("Session habis, silakan login kembali");
      logout();
    },
    5 * 60 * 1000,
  );
}

/* ================================
   LOGIN
   ================================ */
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "login",
      username: user,
      password: pass,
      token: TOKEN,
    }),
  })
    .then((res) => res.text())
    .then((text) => {
      let res;
      try {
        res = JSON.parse(text);
      } catch {
        alert("Server error");
        return;
      }

      if (res.status === "ok") {
        sessionStorage.setItem("login", "true");

        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app").style.display = "block";

        startSessionTimer();
      } else {
        if (error) error.style.display = "block";
      }
    })
    .catch(() => alert("Gagal koneksi"));
}

function logout() {
  sessionStorage.removeItem("login");
  location.reload();
}

/* ================================
   LOADING
   ================================ */
let progress = 0;

function setProgress(val) {
  const bar = document.querySelector(".loading-progress");
  if (!bar) return;
  bar.style.width = val + "%";
}

function openApp() {
  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
}

/* ================================
   INIT
   ================================ */
document.addEventListener("DOMContentLoaded", () => {
  const isLogin = sessionStorage.getItem("login");

  if (isLogin !== "true") {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("app").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
    return;
  }

  startSessionTimer();

  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll(".auto-tanggal").forEach((el) => {
    el.value = today;
  });

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
   FORM
   ================================ */
function ubahForm() {
  formBeli.classList.add("hidden");
  formJual.classList.add("hidden");
  formTetap.classList.add("hidden");
  formVariabel.classList.add("hidden");
  formSwap.classList.add("hidden");
  formPindah.classList.add("hidden");

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

  if (sheet.value === "Swap") {
    formSwap.classList.remove("hidden");
    loadSwap();
  }

  if (sheet.value === "Pindah") {
    formPindah.classList.remove("hidden");
    loadPindah();
  }
}

/* ================================
   LOAD BLOK SWAP
   ================================ */
function loadSwap() {
  fetch(
    URL +
      "?action=posisi&sheet=" +
      encodeURIComponent("Beli sapi") +
      "&token=" +
      TOKEN,
  )
    .then((r) => r.json())
    .then((terpakai) => {
      const s1 = document.getElementById("swap1");
      const s2 = document.getElementById("swap2");

      if (!s1 || !s2) return;

      s1.innerHTML = `<option value="">-- Pilih Blok --</option>`;
      s2.innerHTML = `<option value="">-- Pilih Blok --</option>`;

      SEMUA_BLOK.forEach((blok) => {
        if (terpakai.includes(blok)) {
          const opt1 = document.createElement("option");
          opt1.value = blok;
          opt1.textContent = blok;

          const opt2 = document.createElement("option");
          opt2.value = blok;
          opt2.textContent = blok;

          s1.appendChild(opt1);
          s2.appendChild(opt2);
        }
      });

      s1.onchange = filterSwap;
      s2.onchange = filterSwap;
    })
    .catch(() => alert("Gagal load data"));
}

function loadPindah() {
  fetch(
    URL +
      "?action=posisi&sheet=" +
      encodeURIComponent("Beli sapi") +
      "&token=" +
      TOKEN,
  )
    .then((r) => r.json())
    .then((terpakai) => {
      const asal = document.getElementById("pindah1");
      const tujuan = document.getElementById("pindah2");

      if (!asal || !tujuan) return;

      asal.innerHTML = `<option value="">-- Pilih Blok --</option>`;
      tujuan.innerHTML = `<option value="">-- Pilih Blok --</option>`;

      SEMUA_BLOK.forEach((blok) => {
        // 👉 kalau ADA isinya → masuk ke asal
        if (terpakai.includes(blok)) {
          const opt = document.createElement("option");
          opt.value = blok;
          opt.textContent = blok;
          asal.appendChild(opt);
        }

        // 👉 kalau KOSONG → masuk ke tujuan
        if (!terpakai.includes(blok)) {
          const opt = document.createElement("option");
          opt.value = blok;
          opt.textContent = blok;
          tujuan.appendChild(opt);
        }
      });
      asal.onchange = filterPindah;
      tujuan.onchange = filterPindah;
    })
    .catch(() => alert("Gagal load data"));
}
/* ================================
   PROSES SWAP (FIX)
   ================================ */
function prosesSwap() {
  const b1 = document.getElementById("swap1").value;
  const b2 = document.getElementById("swap2").value;

  if (!b1 || !b2) {
    alert("Pilih dua blok dulu");
    return;
  }

  if (b1 === b2) {
    alert("Blok tidak boleh sama");
    return;
  }

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "swapBlok",
      sheet: "Beli sapi",
      blok1: b1,
      blok2: b2,
      token: TOKEN,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "ok") {
        alert("Swap berhasil");

        // ✅ tambahan (UX fix)
        document.getElementById("swap1").value = "";
        document.getElementById("swap2").value = "";

        loadSwap();
      } else {
        alert("Swap gagal: " + res.msg);
      }
    })
    .catch(() => alert("Swap gagal"));
}

/* ================================
   PROSES PINDAH (FIX)
   ================================ */
function prosesPindah() {
  const asal = document.getElementById("pindah1").value;
  const tujuan = document.getElementById("pindah2").value;

  if (!asal || !tujuan) {
    alert("Pilih blok dulu");
    return;
  }

  // ✅ tambahan penting
  if (asal === tujuan) {
    alert("Blok tidak boleh sama");
    return;
  }

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "pindahBlok",
      sheet: "Beli sapi",
      asal: asal,
      tujuan: tujuan,
      token: TOKEN,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "ok") {
        alert("Pindah berhasil");

        // ✅ pindahin reset ke sini (bukan di atas)
        document.getElementById("pindah1").value = "";
        document.getElementById("pindah2").value = "";

        loadPindah();
        loadSwap();
      } else {
        alert(res.msg);
      }
    })
    .catch(() => alert("Pindah gagal"));
}

/* ================================
   FILTER SWAP (UX BIAR RAPI)
   ================================ */
function filterSwap() {
  const swap1 = document.getElementById("swap1");
  const swap2 = document.getElementById("swap2");

  const v1 = swap1.value;
  const v2 = swap2.value;

  [...swap1.options].forEach((opt) => {
    opt.disabled = opt.value === v2;
  });

  [...swap2.options].forEach((opt) => {
    opt.disabled = opt.value === v1;
  });
}

function filterPindah() {
  const asal = document.getElementById("pindah1");
  const tujuan = document.getElementById("pindah2");

  const v1 = asal.value;
  const v2 = tujuan.value;

  [...asal.options].forEach((opt) => {
    opt.disabled = opt.value === v2;
  });

  [...tujuan.options].forEach((opt) => {
    opt.disabled = opt.value === v1;
  });
}

/* ================================
   LOAD BLOK (FIX TOKEN)
   ================================ */
function loadBlok(sheetName, selectId) {
  fetch(
    URL +
      "?action=posisi&sheet=" +
      encodeURIComponent(sheetName) +
      "&token=" +
      TOKEN,
  )
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
    })
    .catch(() => alert("Gagal load blok"));
}

/* ================================
   KIRIM DATA (FIX TOKEN)
   ================================ */
function kirim() {
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
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      ...data,
      token: TOKEN,
    }),
  })
    .then(() => {
      alert("Data berhasil disimpan");
      resetFormAktif();
    })
    .catch(() => alert("Gagal menyimpan data"));
}

/* ================================
   RESET
   ================================ */
function resetFormAktif() {
  const today = new Date().toISOString().split("T")[0];

  document.querySelectorAll(".uang").forEach((i) => (i.value = ""));
  document.querySelectorAll(".auto-tanggal").forEach((i) => (i.value = today));

  if (sheet.value === "Beli sapi") loadBlok("Beli sapi", "posisi");
  if (sheet.value === "Jual sapi") loadBlok("Jual sapi", "posisiJual");
}

/* ================================
   FORMAT
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

/* ================================
   ONLINE / OFFLINE
   ================================ */
window.addEventListener("offline", () => {
  console.warn("Offline...");
});

window.addEventListener("online", () => {
  location.reload();
});
