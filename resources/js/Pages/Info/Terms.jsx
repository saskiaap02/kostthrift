import InfoPage from '@/Components/Info/InfoPage';

export default function Terms({ contactEmail, updatedAt }) {
    const sections = [
        {
            heading: '1. Tentang KosThrift',
            paragraphs: [
                'KosThrift adalah platform yang mempertemukan mahasiswa penjual dan pembeli perlengkapan kos. KosThrift hanya menyediakan tempat memasang iklan dan mencatat pesanan.',
                'KosThrift bukan penjual, bukan pihak dalam jual beli antar pengguna, dan tidak menerima, memegang, ataupun memproses uang pengguna.',
            ],
        },
        {
            heading: '2. Akun',
            items: [
                'Kamu harus mahasiswa aktif dan memberikan data yang benar.',
                'Satu orang hanya boleh memiliki satu akun.',
                'Jaga kerahasiaan password. Aktivitas di akunmu menjadi tanggung jawabmu.',
            ],
        },
        {
            heading: '3. Verifikasi KTM',
            paragraphs: [
                'Penjual wajib terverifikasi sebelum memasang iklan, dan pembeli wajib terverifikasi sebelum checkout. Verifikasi dilakukan dengan mengunggah foto KTM yang diperiksa admin.',
                'Admin berhak menolak pengajuan yang tidak jelas atau tidak sesuai. Status terverifikasi hanya menandakan pemilik akun mengaku mahasiswa dan KTM-nya telah diperiksa. Itu bukan jaminan bahwa pengguna tersebut jujur atau barangnya sesuai.',
                'Cara foto KTM diperlakukan dijelaskan di Kebijakan Privasi.',
            ],
        },
        {
            heading: '4. Iklan',
            paragraphs: ['Penjual bertanggung jawab atas isi iklannya.'],
            items: [
                'Jual hanya barang milikmu sendiri, dengan foto dan deskripsi yang jujur tentang kondisinya.',
                'Dilarang menjual barang ilegal atau berbahaya, barang curian, produk palsu atau bajakan, obat dan zat terlarang, senjata, konten dewasa, hewan hidup, serta barang atau data yang melanggar hak orang lain.',
                'Dilarang menampilkan data pribadi orang lain di iklan.',
            ],
        },
        {
            heading: '5. Transaksi antar pengguna',
            paragraphs: [
                'Pembeli dan penjual bersepakat sendiri tentang harga, waktu, dan tempat pertemuan. Pembayaran dilakukan dengan salah satu cara berikut: COD (bayar tunai saat bertemu) atau transfer langsung ke rekening atau e-wallet penjual.',
                'KosThrift tidak menjamin kualitas barang, ketepatan pembayaran, maupun penyerahan barang. Periksa barang sebelum membayar. Jika terjadi masalah, penyelesaiannya dilakukan antara pembeli dan penjual. KosThrift tidak dapat mengembalikan uang.',
            ],
        },
        {
            heading: '6. Keamanan pembayaran',
            items: [
                'Transfer hanya ke rekening yang tertera di halaman pesananmu setelah penjual menyetujui pesanan.',
                'Jangan pernah membagikan OTP, PIN, atau password kepada siapa pun, termasuk yang mengaku admin KosThrift.',
                'Admin KosThrift tidak pernah meminta uang dari pengguna.',
            ],
        },
        {
            heading: '7. Perilaku yang dilarang',
            items: [
                'Penipuan, termasuk menerima pembayaran tanpa menyerahkan barang atau sebaliknya.',
                'Pelecehan, ancaman, atau ujaran kebencian.',
                'Spam, iklan palsu, dan manipulasi harga atau ulasan.',
                'Membuat akun ganda atau memakai identitas orang lain.',
            ],
        },
        {
            heading: '8. Moderasi dan sanksi',
            paragraphs: [
                'Admin dapat menurunkan iklan, menolak verifikasi, atau menangguhkan akun yang melanggar ketentuan ini, dengan atau tanpa pemberitahuan terlebih dahulu.',
            ],
        },
        {
            heading: '9. Batas tanggung jawab',
            paragraphs: [
                'KosThrift disediakan apa adanya. Sejauh diizinkan hukum, KosThrift tidak bertanggung jawab atas kerugian yang timbul dari transaksi antar pengguna, termasuk kerugian akibat penipuan oleh pengguna lain.',
            ],
        },
        {
            heading: '10. Perubahan dan kontak',
            paragraphs: [
                'Ketentuan ini dapat diperbarui. Perubahan berlaku sejak dipublikasikan di halaman ini.',
                `Pertanyaan atau laporan: ${contactEmail}`,
            ],
        },
    ];

    return (
        <InfoPage
            title="Syarat & Ketentuan"
            intro="Aturan main yang berlaku bagi semua pengguna KosThrift."
            updatedAt={updatedAt}
            notice="KosThrift adalah proyek tugas kuliah. Dokumen ini berupa draf dan belum ditinjau oleh ahli hukum. Tinjau dan sesuaikan sebelum dipakai untuk layanan sungguhan."
            sections={sections}
        />
    );
}
