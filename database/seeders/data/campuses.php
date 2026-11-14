<?php

/**
 * Data awal universitas dan kampus (starter set, perlu diverifikasi dan dilengkapi).
 * Satu universitas bisa punya banyak kampus. Slug kampus dibuat otomatis: {slug-universitas}-{nama-kampus}.
 * Contoh hasil: unsri-indralaya, unsri-bukit, ui-depok.
 */

return [
    [
        'name' => 'Universitas Indonesia',
        'short_name' => 'UI',
        'slug' => 'ui',
        'campuses' => [
            ['name' => 'Depok', 'city' => 'Depok', 'province' => 'Jawa Barat'],
            ['name' => 'Salemba', 'city' => 'Jakarta', 'province' => 'DKI Jakarta'],
        ],
    ],
    [
        'name' => 'Universitas Negeri Jakarta',
        'short_name' => 'UNJ',
        'slug' => 'unj',
        'campuses' => [
            ['name' => 'Rawamangun', 'city' => 'Jakarta', 'province' => 'DKI Jakarta'],
        ],
    ],
    [
        'name' => 'Bina Nusantara University',
        'short_name' => 'Binus',
        'slug' => 'binus',
        'campuses' => [
            ['name' => 'Kemanggisan', 'city' => 'Jakarta', 'province' => 'DKI Jakarta'],
            ['name' => 'Alam Sutera', 'city' => 'Tangerang', 'province' => 'Banten'],
        ],
    ],
    [
        'name' => 'Institut Teknologi Bandung',
        'short_name' => 'ITB',
        'slug' => 'itb',
        'campuses' => [
            ['name' => 'Ganesha', 'city' => 'Bandung', 'province' => 'Jawa Barat'],
            ['name' => 'Jatinangor', 'city' => 'Sumedang', 'province' => 'Jawa Barat'],
        ],
    ],
    [
        'name' => 'Universitas Padjadjaran',
        'short_name' => 'Unpad',
        'slug' => 'unpad',
        'campuses' => [
            ['name' => 'Jatinangor', 'city' => 'Sumedang', 'province' => 'Jawa Barat'],
            ['name' => 'Dipati Ukur', 'city' => 'Bandung', 'province' => 'Jawa Barat'],
        ],
    ],
    [
        'name' => 'Universitas Pendidikan Indonesia',
        'short_name' => 'UPI',
        'slug' => 'upi',
        'campuses' => [
            ['name' => 'Setiabudi', 'city' => 'Bandung', 'province' => 'Jawa Barat'],
        ],
    ],
    [
        'name' => 'Telkom University',
        'short_name' => 'Tel-U',
        'slug' => 'telkom',
        'campuses' => [
            ['name' => 'Bandung', 'city' => 'Bandung', 'province' => 'Jawa Barat'],
        ],
    ],
    [
        'name' => 'Institut Pertanian Bogor',
        'short_name' => 'IPB',
        'slug' => 'ipb',
        'campuses' => [
            ['name' => 'Dramaga', 'city' => 'Bogor', 'province' => 'Jawa Barat'],
            ['name' => 'Baranangsiang', 'city' => 'Bogor', 'province' => 'Jawa Barat'],
        ],
    ],
    [
        'name' => 'Universitas Diponegoro',
        'short_name' => 'Undip',
        'slug' => 'undip',
        'campuses' => [
            ['name' => 'Tembalang', 'city' => 'Semarang', 'province' => 'Jawa Tengah'],
            ['name' => 'Pleburan', 'city' => 'Semarang', 'province' => 'Jawa Tengah'],
        ],
    ],
    [
        'name' => 'Universitas Negeri Semarang',
        'short_name' => 'Unnes',
        'slug' => 'unnes',
        'campuses' => [
            ['name' => 'Sekaran', 'city' => 'Semarang', 'province' => 'Jawa Tengah'],
        ],
    ],
    [
        'name' => 'Universitas Sebelas Maret',
        'short_name' => 'UNS',
        'slug' => 'uns',
        'campuses' => [
            ['name' => 'Kentingan', 'city' => 'Surakarta', 'province' => 'Jawa Tengah'],
            ['name' => 'Pabelan', 'city' => 'Sukoharjo', 'province' => 'Jawa Tengah'],
        ],
    ],
    [
        'name' => 'Universitas Gadjah Mada',
        'short_name' => 'UGM',
        'slug' => 'ugm',
        'campuses' => [
            ['name' => 'Bulaksumur', 'city' => 'Yogyakarta', 'province' => 'DI Yogyakarta'],
        ],
    ],
    [
        'name' => 'Universitas Negeri Yogyakarta',
        'short_name' => 'UNY',
        'slug' => 'uny',
        'campuses' => [
            ['name' => 'Karangmalang', 'city' => 'Sleman', 'province' => 'DI Yogyakarta'],
        ],
    ],
    [
        'name' => 'Institut Teknologi Sepuluh Nopember',
        'short_name' => 'ITS',
        'slug' => 'its',
        'campuses' => [
            ['name' => 'Sukolilo', 'city' => 'Surabaya', 'province' => 'Jawa Timur'],
            ['name' => 'Manyar', 'city' => 'Surabaya', 'province' => 'Jawa Timur'],
        ],
    ],
    [
        'name' => 'Universitas Airlangga',
        'short_name' => 'Unair',
        'slug' => 'unair',
        'campuses' => [
            ['name' => 'Kampus C (Mulyorejo)', 'city' => 'Surabaya', 'province' => 'Jawa Timur'],
            ['name' => 'Kampus B (Airlangga)', 'city' => 'Surabaya', 'province' => 'Jawa Timur'],
            ['name' => 'Kampus A (Dharmawangsa)', 'city' => 'Surabaya', 'province' => 'Jawa Timur'],
        ],
    ],
    [
        'name' => 'Universitas Negeri Surabaya',
        'short_name' => 'Unesa',
        'slug' => 'unesa',
        'campuses' => [
            ['name' => 'Ketintang', 'city' => 'Surabaya', 'province' => 'Jawa Timur'],
            ['name' => 'Lidah Wetan', 'city' => 'Surabaya', 'province' => 'Jawa Timur'],
        ],
    ],
    [
        'name' => 'Universitas Brawijaya',
        'short_name' => 'UB',
        'slug' => 'ub',
        'campuses' => [
            ['name' => 'Veteran', 'city' => 'Malang', 'province' => 'Jawa Timur'],
        ],
    ],
    [
        'name' => 'Universitas Negeri Malang',
        'short_name' => 'UM',
        'slug' => 'um',
        'campuses' => [
            ['name' => 'Malang', 'city' => 'Malang', 'province' => 'Jawa Timur'],
        ],
    ],
    [
        'name' => 'Universitas Udayana',
        'short_name' => 'Udayana',
        'slug' => 'udayana',
        'campuses' => [
            ['name' => 'Bukit Jimbaran', 'city' => 'Badung', 'province' => 'Bali'],
            ['name' => 'Sudirman', 'city' => 'Denpasar', 'province' => 'Bali'],
        ],
    ],
    [
        'name' => 'Universitas Sriwijaya',
        'short_name' => 'Unsri',
        'slug' => 'unsri',
        'campuses' => [
            ['name' => 'Indralaya', 'city' => 'Ogan Ilir', 'province' => 'Sumatera Selatan'],
            ['name' => 'Bukit', 'city' => 'Palembang', 'province' => 'Sumatera Selatan'],
        ],
    ],
    [
        'name' => 'UIN Raden Fatah Palembang',
        'short_name' => 'UIN RF',
        'slug' => 'uin-raden-fatah',
        'campuses' => [
            ['name' => 'Palembang', 'city' => 'Palembang', 'province' => 'Sumatera Selatan'],
        ],
    ],
    [
        'name' => 'Politeknik Negeri Sriwijaya',
        'short_name' => 'Polsri',
        'slug' => 'polsri',
        'campuses' => [
            ['name' => 'Palembang', 'city' => 'Palembang', 'province' => 'Sumatera Selatan'],
        ],
    ],
    [
        'name' => 'Universitas Muhammadiyah Palembang',
        'short_name' => 'UMP',
        'slug' => 'ump',
        'campuses' => [
            ['name' => 'Palembang', 'city' => 'Palembang', 'province' => 'Sumatera Selatan'],
        ],
    ],
    [
        'name' => 'Universitas Bina Darma',
        'short_name' => 'Binadarma',
        'slug' => 'binadarma',
        'campuses' => [
            ['name' => 'Palembang', 'city' => 'Palembang', 'province' => 'Sumatera Selatan'],
        ],
    ],
    [
        'name' => 'Universitas Sumatera Utara',
        'short_name' => 'USU',
        'slug' => 'usu',
        'campuses' => [
            ['name' => 'Padang Bulan', 'city' => 'Medan', 'province' => 'Sumatera Utara'],
        ],
    ],
    [
        'name' => 'Universitas Syiah Kuala',
        'short_name' => 'USK',
        'slug' => 'usk',
        'campuses' => [
            ['name' => 'Darussalam', 'city' => 'Banda Aceh', 'province' => 'Aceh'],
        ],
    ],
    [
        'name' => 'Universitas Andalas',
        'short_name' => 'Unand',
        'slug' => 'unand',
        'campuses' => [
            ['name' => 'Limau Manis', 'city' => 'Padang', 'province' => 'Sumatera Barat'],
        ],
    ],
    [
        'name' => 'Universitas Negeri Padang',
        'short_name' => 'UNP',
        'slug' => 'unp',
        'campuses' => [
            ['name' => 'Air Tawar', 'city' => 'Padang', 'province' => 'Sumatera Barat'],
        ],
    ],
    [
        'name' => 'Universitas Riau',
        'short_name' => 'Unri',
        'slug' => 'unri',
        'campuses' => [
            ['name' => 'Bina Widya', 'city' => 'Pekanbaru', 'province' => 'Riau'],
        ],
    ],
    [
        'name' => 'Universitas Jambi',
        'short_name' => 'Unja',
        'slug' => 'unja',
        'campuses' => [
            ['name' => 'Mendalo', 'city' => 'Muaro Jambi', 'province' => 'Jambi'],
        ],
    ],
    [
        'name' => 'Universitas Bengkulu',
        'short_name' => 'Unib',
        'slug' => 'unib',
        'campuses' => [
            ['name' => 'Kandang Limun', 'city' => 'Bengkulu', 'province' => 'Bengkulu'],
        ],
    ],
    [
        'name' => 'Universitas Lampung',
        'short_name' => 'Unila',
        'slug' => 'unila',
        'campuses' => [
            ['name' => 'Gedong Meneng', 'city' => 'Bandar Lampung', 'province' => 'Lampung'],
        ],
    ],
    [
        'name' => 'Universitas Tanjungpura',
        'short_name' => 'Untan',
        'slug' => 'untan',
        'campuses' => [
            ['name' => 'Pontianak', 'city' => 'Pontianak', 'province' => 'Kalimantan Barat'],
        ],
    ],
    [
        'name' => 'Universitas Lambung Mangkurat',
        'short_name' => 'ULM',
        'slug' => 'ulm',
        'campuses' => [
            ['name' => 'Banjarmasin', 'city' => 'Banjarmasin', 'province' => 'Kalimantan Selatan'],
            ['name' => 'Banjarbaru', 'city' => 'Banjarbaru', 'province' => 'Kalimantan Selatan'],
        ],
    ],
    [
        'name' => 'Universitas Mulawarman',
        'short_name' => 'Unmul',
        'slug' => 'unmul',
        'campuses' => [
            ['name' => 'Gunung Kelua', 'city' => 'Samarinda', 'province' => 'Kalimantan Timur'],
        ],
    ],
    [
        'name' => 'Universitas Hasanuddin',
        'short_name' => 'Unhas',
        'slug' => 'unhas',
        'campuses' => [
            ['name' => 'Tamalanrea', 'city' => 'Makassar', 'province' => 'Sulawesi Selatan'],
            ['name' => 'Gowa', 'city' => 'Gowa', 'province' => 'Sulawesi Selatan'],
        ],
    ],
    [
        'name' => 'Universitas Sam Ratulangi',
        'short_name' => 'Unsrat',
        'slug' => 'unsrat',
        'campuses' => [
            ['name' => 'Bahu', 'city' => 'Manado', 'province' => 'Sulawesi Utara'],
        ],
    ],
    [
        'name' => 'Universitas Mataram',
        'short_name' => 'Unram',
        'slug' => 'unram',
        'campuses' => [
            ['name' => 'Mataram', 'city' => 'Mataram', 'province' => 'Nusa Tenggara Barat'],
        ],
    ],
    [
        'name' => 'Universitas Cenderawasih',
        'short_name' => 'Uncen',
        'slug' => 'uncen',
        'campuses' => [
            ['name' => 'Waena', 'city' => 'Jayapura', 'province' => 'Papua'],
        ],
    ],
];
