import InfoPage from '@/Components/Info/InfoPage';

export default function Meetup() {
    const sections = [
        {
            heading: 'Pilih tempat yang tepat',
            items: [
                'Area ramai dan terang di dalam kampus: perpustakaan, kantin pusat, halte, atau dekat pos satpam.',
                'Hindari tempat sepi, kamar kos pribadi, atau lokasi yang diusulkan secara mendadak.',
                'Pilih siang atau sore hari.',
            ],
        },
        {
            heading: 'Sebelum bertemu',
            items: [
                'Sepakati waktu dan tempat lewat catatan pesanan, dan pastikan lawan transaksimu sama dengan yang ada di pesanan.',
                'Beri tahu temanmu ke mana dan kapan kamu bertemu. Lebih baik ajak satu teman.',
                'Siapkan uang pas jika membayar tunai.',
            ],
        },
        {
            heading: 'Saat bertemu',
            items: [
                'Periksa barang dengan teliti sebelum membayar. Untuk elektronik, coba langsung.',
                'Bayar setelah kamu puas dengan barangnya.',
                'Batalkan dengan sopan jika barang tidak sesuai atau kamu merasa tidak aman, dan tinggalkan tempat itu.',
            ],
        },
        {
            heading: 'Catatan',
            paragraphs: [
                'KosThrift belum memiliki daftar titik temu resmi untuk tiap kampus. Pilihan di atas hanya panduan umum. Kenali sendiri area kampusmu dan utamakan keselamatanmu.',
            ],
        },
    ];

    return (
        <InfoPage
            title="Titik Temu COD"
            intro="Tips bertemu langsung dengan aman saat COD di kampus."
            sections={sections}
        />
    );
}
