<?php

return [
    /*
    | Disk penyimpanan foto KTM. WAJIB disk PRIVAT (bukan "public").
    | Lokal: "local" (storage/app/private). Hosting serverless (mis. Vercel): pakai bucket S3-compatible
    | yang diset privat, lalu isi KTM_DISK=s3 di environment.
    */
    'disk' => env('KTM_DISK', 'local'),

    'directory' => 'ktm',

    // Foto dikecilkan ke lebar maksimum ini (px) saat disimpan.
    'max_width' => 1600,

    // Hanya dipakai AdminSeeder. Di luar environment "local", wajib diisi lewat environment.
    'admin' => [
        'email' => env('ADMIN_EMAIL'),
        'password' => env('ADMIN_PASSWORD'),
    ],
];
