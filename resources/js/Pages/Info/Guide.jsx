import InfoPage from '@/Components/Info/InfoPage';

export default function Guide() {
    const sections = [
        {
            heading: 'Prinsip dasar',
            paragraphs: [
                'Transaksi di KosThrift terjadi langsung antara pembeli dan penjual. KosThrift tidak memegang uang. Karena itu kehati-hatianmu adalah perlindungan terbaik.',
            ],
        },
        {
            heading: 'Untuk pembeli',
            items: [
                'Verifikasi KTM sekali, lalu tambahkan barang ke troli dan checkout per penjual.',
                'Pilih COD atau transfer langsung, dan tulis catatan jika perlu (misalnya waktu yang kamu inginkan).',
                'Tunggu penjual menyetujui pesanan. Barang yang kamu pesan ditahan untukmu sampai pesanan selesai atau dibatalkan.',
                'COD: bertemu, periksa barang, baru bayar tunai.',
                'Transfer: setelah disetujui, transfer ke rekening yang tertera di halaman pesanan, lalu tekan "Saya sudah transfer". Simpan bukti transfermu.',
                'Setelah barang kamu terima, tandai pesanan selesai.',
            ],
        },
        {
            heading: 'Untuk penjual',
            items: [
                'Setelah terverifikasi, pasang iklan dengan foto jelas dan deskripsi jujur.',
                'Jika menerima pembayaran transfer, isi dulu rekening atau e-wallet di Rekening Pembayaran.',
                'Lihat profil pembeli di pesanan masuk, lalu setujui atau tolak.',
                'Untuk transfer, pastikan uang benar-benar masuk ke rekeningmu sebelum menekan konfirmasi dan menyerahkan barang.',
                'Setelah barang diserahkan, tandai pesanan selesai.',
            ],
        },
        {
            heading: 'Tips keamanan',
            items: [
                'Jangan transfer ke rekening yang tidak tertera di halaman pesananmu.',
                'Jangan bagikan OTP, PIN, atau password kepada siapa pun.',
                'Waspadai harga yang terlalu murah atau permintaan memindahkan percakapan ke luar KosThrift.',
                'Untuk barang elektronik, minta dicoba langsung sebelum membayar.',
                'Lihat halaman Titik Temu COD untuk tips bertemu dengan aman.',
            ],
        },
    ];

    return (
        <InfoPage
            title="Panduan Transaksi"
            intro="Langkah jual beli yang aman antar mahasiswa."
            sections={sections}
        />
    );
}
