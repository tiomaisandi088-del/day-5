// =====================================
// 1. DATA AWAL INVENTARIS
// =====================================

const daftarBarang = [
  {
    kode: "INV-001",
    nama: "Laptop",
    stok: 10,
    harga: 7500000
  },
  {
    kode: "INV-002",
    nama: "Mouse",
    stok: 3,
    harga: 150000
  },
  {
    kode: "INV-003",
    nama: "Keyboard",
    stok: 0,
    harga: 300000
  },
  {
    kode: "INV-004",
    nama: "Monitor",
    stok: 7,
    harga: 1800000
  }
];


// =====================================
// 2. MENGAMBIL ELEMEN HTML
// =====================================

const tabelBarang = document.getElementById("tabelBarang");
const totalJenis = document.getElementById("totalJenis");
const totalStok = document.getElementById("totalStok");
const totalNilai = document.getElementById("totalNilai");

const formBarang = document.getElementById("formBarang");
const inputKode = document.getElementById("kode");
const inputNama = document.getElementById("nama");
const inputStok = document.getElementById("stok");
const inputHarga = document.getElementById("harga");

const cariBarang = document.getElementById("cariBarang");
const pesanForm = document.getElementById("pesanForm");
const infoHasil = document.getElementById("infoHasil");


// =====================================
// 3. FUNGSI FORMAT RUPIAH
// =====================================

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}


// =====================================
// 4. FUNGSI MENENTUKAN STATUS STOK
// =====================================

function tentukanStatus(stok) {
  if (stok === 0) {
    return "Habis";
  } else if (stok < 5) {
    return "Menipis";
  } else {
    return "Aman";
  }
}


// =====================================
// 5. FUNGSI MENGHITUNG NILAI BARANG
// =====================================

function hitungNilaiBarang(harga, stok) {
  return harga * stok;
}


// =====================================
// 6. FUNGSI MENGAMANKAN TEKS HTML
// =====================================

// Agar input teks tidak diperlakukan sebagai kode HTML.
function escapeHTML(teks) {
  return String(teks).replace(/[&<>"']/g, function (karakter) {
    const pengganti = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return pengganti[karakter];
  });
}


// =====================================
// 7. FUNGSI MENGHITUNG RINGKASAN
// =====================================

function tampilkanRingkasan() {
  let jumlahJenis = daftarBarang.length;
  let jumlahStok = 0;
  let jumlahNilai = 0;

  for (const barang of daftarBarang) {
    jumlahStok += barang.stok;

    jumlahNilai += hitungNilaiBarang(
      barang.harga,
      barang.stok
    );
  }

  totalJenis.textContent = jumlahJenis;
  totalStok.textContent = jumlahStok;
  totalNilai.textContent = formatRupiah(jumlahNilai);
}


// =====================================
// 8. FUNGSI MENAMPILKAN TABEL
// =====================================

function tampilkanTabel(data) {
  tabelBarang.innerHTML = "";

  if (data.length === 0) {
    const baris = document.createElement("tr");
    const sel = document.createElement("td");

    sel.colSpan = 7;
    sel.className = "empty-row";
    sel.textContent = "Data barang tidak ditemukan.";

    baris.appendChild(sel);
    tabelBarang.appendChild(baris);

    infoHasil.textContent = "Tidak ada data yang cocok.";
    return;
  }

  for (let i = 0; i < data.length; i++) {
    const barang = data[i];

    const status = tentukanStatus(barang.stok);
    const nilai = hitungNilaiBarang(
      barang.harga,
      barang.stok
    );

    let kelasStatus = "";

    if (status === "Aman") {
      kelasStatus = "aman";
    } else if (status === "Menipis") {
      kelasStatus = "menipis";
    } else {
      kelasStatus = "habis";
    }

    const baris = `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHTML(barang.kode)}</td>
        <td>${escapeHTML(barang.nama)}</td>
        <td>${barang.stok}</td>
        <td>${formatRupiah(barang.harga)}</td>
        <td>${formatRupiah(nilai)}</td>
        <td>
          <span class="badge ${kelasStatus}">
            ${status}
          </span>
        </td>
      </tr>
    `;

    tabelBarang.insertAdjacentHTML("beforeend", baris);
  }

  infoHasil.textContent =
    `Menampilkan ${data.length} dari ${daftarBarang.length} jenis barang.`;
}


// =====================================
// 9. FUNGSI MENAMPILKAN SELURUH DATA
// =====================================

function tampilkanData() {
  tampilkanRingkasan();

  const kataKunci = cariBarang.value
    .trim()
    .toLowerCase();

  const hasilPencarian = daftarBarang.filter(function (barang) {
    return (
      barang.kode.toLowerCase().includes(kataKunci) ||
      barang.nama.toLowerCase().includes(kataKunci) ||
      barang.stok.toString().includes(kataKunci)
    );
  });

  tampilkanTabel(hasilPencarian);
}


// =====================================
// 10. EVENT PENCARIAN
// =====================================

cariBarang.addEventListener("input", function () {
  tampilkanData();
});


// =====================================
// 11. EVENT FORM TAMBAH BARANG
// =====================================

formBarang.addEventListener("submit", function (event) {
  // Mencegah browser memuat ulang halaman.
  event.preventDefault();

  const kode = inputKode.value.trim().toUpperCase();
  const nama = inputNama.value.trim();

  const stok = Number(inputStok.value);
  const harga = Number(inputHarga.value);

  // Validasi input.
  if (
    kode === "" ||
    nama === "" ||
    inputStok.value.trim() === "" ||
    inputHarga.value.trim() === ""
  ) {
    tampilkanPesan("Semua kolom wajib diisi.", "error");
    return;
  }

  if (
    !Number.isSafeInteger(stok) ||
    stok < 0
  ) {
    tampilkanPesan(
      "Stok harus berupa bilangan bulat dan tidak boleh negatif.",
      "error"
    );
    return;
  }

  if (
    !Number.isSafeInteger(harga) ||
    harga < 0
  ) {
    tampilkanPesan(
      "Harga harus berupa bilangan bulat dan tidak boleh negatif.",
      "error"
    );
    return;
  }

  // Memeriksa kode barang agar tidak duplikat.
  const kodeSudahAda = daftarBarang.some(function (barang) {
    return barang.kode.toLowerCase() === kode.toLowerCase();
  });

  if (kodeSudahAda) {
    tampilkanPesan(
      "Kode barang sudah digunakan. Gunakan kode lain.",
      "error"
    );
    return;
  }

  // Membuat object barang baru.
  const barangBaru = {
    kode: kode,
    nama: nama,
    stok: stok,
    harga: harga
  };

  // Memasukkan object ke array.
  daftarBarang.push(barangBaru);

  // Mengosongkan pencarian agar barang baru terlihat.
  cariBarang.value = "";

  // Memperbarui ringkasan dan tabel.
  tampilkanData();

  // Mengosongkan form.
  formBarang.reset();

  // Menampilkan pesan sukses.
  tampilkanPesan(
    "Barang berhasil ditambahkan.",
    "success"
  );
});


// =====================================
// 12. FUNGSI PESAN FORM
// =====================================

function tampilkanPesan(pesan, jenis) {
  pesanForm.textContent = pesan;
  pesanForm.className = "form-message " + jenis;
}


// =====================================
// 13. MENJALANKAN PROGRAM PERTAMA KALI
// =====================================

tampilkanData();