const URL =
  "https://script.google.com/macros/s/AKfycbxL5FNQn80V2FPXqbtX3sLfkCX7Piy_Ozpfv7FH4AKfQvXoRJjS1gBdVxV9WCBbRsSEyA/exec";

function ubahForm() {
  formBeli.classList.add("hidden");
  formTetap.classList.add("hidden");
  formVariabel.classList.add("hidden");

  if (sheet.value === "Beli sapi") formBeli.classList.remove("hidden");
  if (sheet.value === "Biaya Tetap") formTetap.classList.remove("hidden");
  if (sheet.value === "Biaya variabel") formVariabel.classList.remove("hidden");
  if (sheet.value === "Jual sapi") formJual.classList.remove("hidden");
}

function kirim() {
  let data = { sheet: sheet.value };

  if (sheet.value === "Beli sapi") {
    data.posisi = posisi.value;
    data.harga = hargaBeli.value;
  }

  if (sheet.value === "Jual sapi") {
    data.posisiJual = posisiJual.value;
    data.Jual = hargaJual.value;
  }

  if (sheet.value === "Biaya Tetap") {
    data.nama = namaTetap.value;
    data.jumlah = Number(JumlahTetap.value);
    data.beras = Number(Beras.value);
  }

  if (sheet.value === "Biaya variabel") {
    data.barang = barang.value;
    data.jumlah = jumlahVar.value;
    data.harga = hargaVar.value;
  }

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  alert("Data berhasil disimpan");
}
