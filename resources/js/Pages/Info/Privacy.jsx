import InfoPage from '@/Components/Info/InfoPage';

export default function Privacy({ contactEmail, updatedAt }) {
    const sections = [
        {
            heading: '1. Data yang kami kumpulkan',
            items: [
                'Akun: nama, email, kampus (opsional), dan password (disimpan dalam bentuk hash, bukan teks asli).',
                'Verifikasi: foto KTM dan universitas yang kamu pilih, hanya selama pemeriksaan berlangsung.',
                'Iklan: judul, deskripsi, foto, harga, dan lokasi COD yang kamu isi.',
                'Aktivitas: wishlist, troli, dan pesanan.',
                'Informasi pembayaran penjual: jenis, nama pemilik, dan nomor rekening atau e-wallet yang diisi penjual sendiri.',
            ],
        },
        {
            heading: '2. Untuk apa data dipakai',
            items: [
                'Menjalankan akun, iklan, troli, dan pesanan.',
                'Memverifikasi bahwa pengguna adalah mahasiswa.',
                'Moderasi: mencegah penipuan dan menurunkan iklan yang melanggar.',
            ],
        },
        {
            heading: '3. Foto KTM',
            items: [
                'Disimpan di penyimpanan privat dengan nama acak, tanpa alamat publik.',
                'Hanya kamu dan admin yang dapat membukanya. Pengguna lain tidak pernah dapat melihatnya.',
                'Metadata foto (termasuk lokasi) dibuang saat diunggah.',
                'Dihapus permanen segera setelah admin memutuskan (disetujui maupun ditolak). Yang tersimpan hanyalah catatan keputusan dan status verifikasimu.',
                'Foto KTM tidak dikirim ke layanan pihak ketiga.',
                'Kamu boleh menutup NIM dan alamat pada fotonya.',
            ],
        },
        {
            heading: '4. Siapa yang dapat melihat datamu',
            items: [
                'Pengguna lain: namamu, kampus, status verifikasi, dan iklanmu.',
                'Pembeli: informasi pembayaran penjual, hanya untuk pesanan yang sudah disetujui penjual tersebut.',
                'Penjual: namamu dan profil singkatmu pada pesanan yang kamu buat.',
                'Admin: data akun dan verifikasi untuk keperluan moderasi.',
                'Kami tidak menjual datamu.',
            ],
        },
        {
            heading: '5. Keamanan',
            paragraphs: [
                'Nomor rekening atau e-wallet disimpan terenkripsi, dan akses ke foto KTM dibatasi. Meski begitu, tidak ada sistem yang sepenuhnya aman. Gunakan password yang kuat dan unik.',
            ],
        },
        {
            heading: '6. Penyimpanan',
            paragraphs: [
                'Data akun disimpan selama akunmu aktif. Foto KTM dihapus segera setelah pemeriksaan selesai.',
            ],
        },
        {
            heading: '7. Cookie dan layanan pihak ketiga',
            paragraphs: [
                'KosThrift memakai cookie sesi agar kamu tetap masuk. Tidak ada pelacak iklan. Font dan ikon dimuat dari layanan pihak ketiga (misalnya Google Fonts), yang dapat menerima alamat IP-mu saat halaman dibuka.',
            ],
        },
        {
            heading: '8. Hakmu',
            paragraphs: [
                `Kamu dapat meminta koreksi atau penghapusan datamu dengan menghubungi ${contactEmail}. Kami akan menanggapi secepat yang kami bisa.`,
            ],
        },
        {
            heading: '9. Perubahan',
            paragraphs: ['Kebijakan ini dapat diperbarui. Perubahan berlaku sejak dipublikasikan di halaman ini.'],
        },
    ];

    return (
        <InfoPage
            title="Kebijakan Privasi"
            intro="Data apa yang kami simpan, untuk apa, dan bagaimana kami menjaganya."
            updatedAt={updatedAt}
            notice="KosThrift adalah proyek tugas kuliah. Dokumen ini berupa draf dan belum ditinjau oleh ahli hukum, termasuk terkait aturan pelindungan data pribadi. Tinjau sebelum dipakai untuk layanan sungguhan."
            sections={sections}
        />
    );
}
