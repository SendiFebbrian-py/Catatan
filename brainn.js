const URL =
  "https://script.google.com/macros/s/AKfycbxL5FNQn80V2FPXqbtX3sLfkCX7Piy_Ozpfv7FH4AKfQvXoRJjS1gBdVxV9WCBbRsSEyA/exec";

function ubahForm() {
  formBeli.classList.add("hidden");
  formTetap.classList.add("hidden");
  formVariabel.classList.add("hidden");
  formJual.classList.add("hidden");
  formHapus.classList.add("hidden");

  if (sheet.value === "Beli sapi") formBeli.classList.remove("hidden");
  if (sheet.value === "Biaya Tetap") formTetap.classList.remove("hidden");
  if (sheet.value === "Biaya variabel") formVariabel.classList.remove("hidden");
  if (sheet.value === "Jual sapi") formJual.classList.remove("hidden");
  if (sheet.value === "hapus") formHapus.classList.remove("hidden");
}

function kirim() {
  let data = { sheet: sheet.value };

  if (sheet.value === "Beli sapi") {
    data.posisi = posisi.value;
    data.tanggalbeli = tanggalbeli.value;
    data.harga = hargaBeli.value;
  }

  if (sheet.value === "Jual sapi") {
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
  });

  alert("Data berhasil disimpan");
}

document.querySelectorAll(".auto-tanggal").forEach((el) => {
  el.value = new Date().toISOString().split("T")[0];
});

function formatRupiah(input) {
  // Ambil hanya angka
  let angka = input.value.replace(/\D/g, "");

  // Format ribuan (.)
  input.value = angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function hapusDenganAI() {
  const keyword = document.getElementById("hapusInput").value.trim();
  if (!keyword) {
    alert("Isi dulu");
    return;
  }

  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword }),
  })
    .then((res) => res.json())
    .then((res) => alert(res.message))
    .catch((err) => {
      console.error(err);
      alert("Gagal terhubung ke server");
    });
}
