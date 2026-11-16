import InfoPage from '@/Components/Info/InfoPage';
import Icon from '@/Components/UI/Icon';

const FAQ = [
    {
        q: 'Bagaimana cara berjualan?',
        a: 'Daftar akun, buka menu avatar lalu Verifikasi KTM, dan unggah foto KTM-mu. Setelah admin menyetujui, tombol Jual akan terbuka dan kamu bisa memasang iklan.',
    },
    {
        q: 'Kenapa harus verifikasi KTM, dan apakah aman?',
        a: 'KosThrift khusus mahasiswa. Foto KTM disimpan privat, hanya bisa dilihat admin, dan dihapus permanen setelah pemeriksaan selesai. Kamu boleh menutup NIM dan alamat. Detailnya ada di Kebijakan Privasi.',
    },
    {
        q: 'Berapa lama verifikasi?',
        a: 'Tergantung antrean admin. Kamu bisa melihat statusnya di halaman Verifikasi KTM. Jika ditolak, alasannya ditampilkan dan kamu bisa mengirim ulang.',
    },
    {
        q: 'Bagaimana cara membeli?',
        a: 'Tambahkan barang ke troli, lalu checkout per penjual. Pilih COD atau transfer langsung ke penjual. Pembeli juga harus terverifikasi KTM sebelum checkout.',
    },
    {
        q: 'Apa bedanya COD dan transfer langsung?',
        a: 'COD: bertemu di kampus, periksa barang, lalu bayar tunai. Transfer langsung: setelah penjual menyetujui pesanan, kamu melihat rekening atau e-wallet penjual dan mentransfer langsung ke sana.',
    },
    {
        q: 'Apakah KosThrift memegang uang saya?',
        a: 'Tidak. KosThrift tidak menerima atau memproses pembayaran. Pembayaran terjadi langsung antara pembeli dan penjual.',
    },
    {
        q: 'Barang tidak sesuai, atau penjual atau pembeli tidak menepati janji?',
        a: 'Selesaikan dulu dengan lawan transaksimu. Jika diduga penipuan, laporkan lewat email kontak di bawah agar admin dapat menurunkan iklan atau menangguhkan akun. KosThrift tidak dapat mengembalikan uang.',
    },
    {
        q: 'Bagaimana mengubah, menghapus, atau menandai iklan terjual?',
        a: 'Buka menu avatar lalu Iklan Saya. Di sana ada tombol Edit, Tandai terjual, dan Hapus untuk tiap iklanmu.',
    },
    {
        q: 'Saya lupa password.',
        a: 'Buka halaman Masuk lalu klik Lupa password.',
    },
];

export default function Help({ contactEmail }) {
    return (
        <InfoPage title="Bantuan" intro="Jawaban untuk pertanyaan yang paling sering muncul.">
            <section>
                <ul className="divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                    {FAQ.map((item) => (
                        <li key={item.q}>
                            <details className="group px-4 py-3">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-body-md font-body-md font-semibold text-on-surface">
                                    {item.q}
                                    <Icon
                                        name="chevron-down"
                                        className="text-[12px] text-outline transition-transform group-open:rotate-180"
                                    />
                                </summary>
                                <p className="mt-2 text-body-md font-body-md leading-relaxed text-on-surface-variant">
                                    {item.a}
                                </p>
                            </details>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="rounded-2xl bg-surface-container-low/70 p-5">
                <h2 className="font-headline-sm text-body-lg font-bold text-on-surface">Masih butuh bantuan?</h2>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Hubungi kami di{' '}
                    <a href={`mailto:${contactEmail}`} className="font-bold text-primary-container hover:underline">
                        {contactEmail}
                    </a>
                    .
                </p>
            </section>
        </InfoPage>
    );
}
