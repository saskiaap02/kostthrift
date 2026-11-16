<?php

return [
    // Email kontak yang tampil di halaman Bantuan, Syarat & Ketentuan, dan Kebijakan Privasi.
    // GANTI di .env (KOSTHRIFT_CONTACT_EMAIL) dengan email yang benar-benar kamu pantau.
    'contact_email' => env('KOSTHRIFT_CONTACT_EMAIL', 'kontak@kosthrift.test'),

    // Tanggal terakhir dokumen hukum diperbarui (tampil di halaman).
    'legal_updated' => 'November 2026',
];
