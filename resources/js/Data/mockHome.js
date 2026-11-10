/**
 * DATA MOCK - hanya untuk langkah 3 (UI statis).
 * Bentuknya meniru output Resource di langkah 4, jadi komponen tidak perlu diubah.
 * File ini dihapus setelah Home.jsx memakai props dari HomeController.
 * Catatan: URL gambar berasal dari Stitch dan bisa kedaluwarsa.
 */

export const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBzO0zxAisF0S-0folLhUGPNdXXECqpyBYajzPZoBO5RxDp-d7qVZO4MeAnllw2Uy4sBniI44Jdg-JSIH1K7n9DsnLxRqXHitNO4CSikr2AujiO2p8RmSflyArfOod1N9AwhrrAHtcCyrh3ttRXiM4ol-5YiF66kngMUi10gLEai-_cDU6lSAslKasKY_Yn4XF79HvFLAoNHSBV9vN_AsUpTi9Ym0yDTq9SBGBecw8Hdj1Em86fQKOIPg";

export const totalProducts = 64;

export const campuses = [
    {
        "slug": "ui",
        "name": "Universitas Indonesia",
        "city": "Depok",
        "zone_label": "Zona UI (Depok)"
    },
    {
        "slug": "itb",
        "name": "Institut Teknologi Bandung",
        "city": "Bandung",
        "zone_label": "Zona ITB (Bandung)"
    },
    {
        "slug": "ugm",
        "name": "Universitas Gadjah Mada",
        "city": "Yogyakarta",
        "zone_label": "Zona UGM (Yogyakarta)"
    },
    {
        "slug": "undip",
        "name": "Universitas Diponegoro",
        "city": "Semarang",
        "zone_label": "Zona UNDIP (Semarang)"
    },
    {
        "slug": "its",
        "name": "Institut Teknologi Sepuluh Nopember",
        "city": "Surabaya",
        "zone_label": "Zona ITS (Surabaya)"
    },
    {
        "slug": "unpad",
        "name": "Universitas Padjadjaran",
        "city": "Jatinangor",
        "zone_label": "Zona UNPAD (Jatinangor)"
    }
];

export const categories = [
    {
        "slug": "elektronik",
        "name": "Elektronik",
        "icon": "lightning-charge"
    },
    {
        "slug": "alat-masak",
        "name": "Alat Masak",
        "icon": "cup-hot"
    },
    {
        "slug": "buku-kuliah",
        "name": "Buku Kuliah",
        "icon": "book"
    },
    {
        "slug": "kasur-lemari",
        "name": "Kasur & Lemari",
        "icon": "door-closed"
    },
    {
        "slug": "lampu-meja",
        "name": "Lampu & Meja",
        "icon": "lightbulb"
    }
];

export const products = [
    {
        "id": 1,
        "slug": "mini-rice-cooker-pastel-0-8l-mulus-like-new-baru-3-bln-pakai",
        "title": "Mini Rice Cooker Pastel 0.8L (Mulus like new, baru 3 bln pakai)",
        "price": 115000,
        "original_price": 250000,
        "discount_percent": 54,
        "condition": "second",
        "condition_label": "Second",
        "location_note": "Kukusan, UI Depok",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCBguuR8NQAGaNsQ6_-2D7nZdFJway0Jzmm91ED_Y_ZlOys_oYl5fhKRODk2nFrjXEko6bON3WnXGRTfmovQL8Opnx6kdwDWpnuF_SYda_PtgdyLEqHoAd5AIRy9vydnIAwa_UY1KX9xicM4ZWu_btGO2fD6LZvsWNz_ygZcTILS0Z_Jiv2lV99e_0lSazIq2qECiTV_aDIBXYVZors3i_CD1FbW1mSPhRi5WlPEvR8PYmtbaAkvabQAw",
        "is_wishlisted": false,
        "category": {
            "slug": "alat-masak",
            "name": "Alat Masak"
        },
        "campus": {
            "slug": "ui"
        },
        "seller": {
            "name": "Rina K.",
            "ktm_verified": true
        }
    },
    {
        "id": 2,
        "slug": "kasur-busa-lipat-portable-90x200-free-sprei",
        "title": "Kasur Busa Lipat Portable 90x200 Free Sprei",
        "price": 140000,
        "original_price": null,
        "discount_percent": null,
        "condition": "second",
        "condition_label": "Second",
        "location_note": "Cisitu, ITB Bandung",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCS61NC3YZI57YLAa6dznJek4pL8KjziWULDu4RZ7vYFfBCMszpB7Cl3-_ZV4bJOVH3xqtm_ut_bCgyw7UCRIKckjiXyryk-p0QnVBSCPo0wyzbNxEeV6hJ7F7FHN7PmTehdI38kGcdJ7OZY21vrYFmwCPdvgP_QDYnUxAMumerS_hCtX78APFwBG30M0dswyllpI85sM-McbNmEtMgQRKyEbmKTDDAM0iHJoDMIZOJt7xMIin0bRUeRg",
        "is_wishlisted": true,
        "category": {
            "slug": "kasur-lemari",
            "name": "Kasur & Lemari"
        },
        "campus": {
            "slug": "itb"
        },
        "seller": {
            "name": "Dimas A.",
            "ktm_verified": true
        }
    },
    {
        "id": 3,
        "slug": "kalkulator-scientific-casio-fx-991ex-asli-segel",
        "title": "Kalkulator Scientific Casio fx-991EX Asli Segel",
        "price": 210000,
        "original_price": null,
        "discount_percent": null,
        "condition": "baru",
        "condition_label": "Baru",
        "location_note": "Pogung, UGM Yogya",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDKvby0LDz2FAjM2tzQHKcl7_wkxkcU8Uc3FcQyQXRmBk0pA_jZ9Og7FyIU-p22PpGEfMboAu4HwKT8q_53b1Xisl0MzGuvLqV6d-EiEtaUQKaY6xG0iR42XlMnj5D4Zecm1DjqxOtsssYbKV1lIlTVTrVadZg0ZLXms5xUB6HS30-uU3Ks3GuxC1xlS0hIJ8bGSrRZ8TW5XG0UO114mGLa_nUYrQty-u8iI-Iunj1DTHBFME40F32e6w",
        "is_wishlisted": false,
        "category": {
            "slug": "elektronik",
            "name": "Elektronik"
        },
        "campus": {
            "slug": "ugm"
        },
        "seller": {
            "name": "Salsa P.",
            "ktm_verified": true
        }
    },
    {
        "id": 4,
        "slug": "lampu-belajar-led-warm-white-3-tingkat-cahaya",
        "title": "Lampu Belajar LED Warm White 3 Tingkat Cahaya",
        "price": 45000,
        "original_price": null,
        "discount_percent": null,
        "condition": "second",
        "condition_label": "Second",
        "location_note": "Tembalang, UNDIP",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBB5-W28ASOPezzyYi_-AsRcF1XC_I_nWGuABsPOzZs_8_9oMWMMuXI7r3pkNBMro5dDXuV2jyiU7NrXD7HzcbERP5yAFUFaZ5MG9cCVztP2XjJUJJyOZ_PQSmfDCCX_XNI-RZYG4Nqmyk-yG4CvN52GEQv_UzboMMR2l7YkpB5c6At7X-zQF8j_ZJmplA5NdiukX-Im08glWfvVFJuo7gjY4jMC2wCkjGDxI9JWlGTH9jHdqb37vaJ5w",
        "is_wishlisted": false,
        "category": {
            "slug": "lampu-meja",
            "name": "Lampu & Meja"
        },
        "campus": {
            "slug": "undip"
        },
        "seller": {
            "name": "Bagas W.",
            "ktm_verified": true
        }
    },
    {
        "id": 5,
        "slug": "buku-paket-kalkulus-purcell-catatan-rangkuman-ujian",
        "title": "Buku Paket Kalkulus Purcell + Catatan Rangkuman Ujian",
        "price": 65000,
        "original_price": null,
        "discount_percent": null,
        "condition": "second",
        "condition_label": "Second",
        "location_note": "Sukolilo, ITS Surabaya",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuA52IGvzSLdDyXDKyCml5xBr_5NG1prJIErFvzxKDh-eYlaIPZZKQ1Boy7XkQVY2icCARdesnHvNdmeBGKxYgdGUP5jgmDlxtiiOyYQ2zo3AgltmFdWpzcUP4FDb9Z_hlF0uOT5dS2j8sxJPXiVRI5MaDqY32CGkBh3llqrgNB3Gbmhfc83PWbGQWuSHTBL0dwDttdj3dw0zwoclN5ZbmQPMKUOaiHnWDBECmhqvEIWeWnnwaB1B99h0A",
        "is_wishlisted": false,
        "category": {
            "slug": "buku-kuliah",
            "name": "Buku Kuliah"
        },
        "campus": {
            "slug": "its"
        },
        "seller": {
            "name": "Nadia F.",
            "ktm_verified": true
        }
    },
    {
        "id": 6,
        "slug": "kipas-angin-meja-kencang-hening-garansi-toko",
        "title": "Kipas Angin Meja Kencang & Hening (Garansi Toko)",
        "price": 75000,
        "original_price": null,
        "discount_percent": null,
        "condition": "baru",
        "condition_label": "Baru",
        "location_note": "Jatinangor, UNPAD",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDPw4_E-a3nQt7viC9X4oZkVZI_NXQUiH79rBW9MDtlizl_uMtVXTMAOGoo2HklkYJF8fh1okrezq-UU42imU6G0yGQ46PX-4dj15Dm6ql-mWhQvGoRBOs3rI5JJeuXyj_OTJCVsJmSY9_28GEqzbGfL8-DayqrwBeID-l7YX7wvBfVD0V9Vp0lociGZmcAPIXJzCM5g2l-vYp4nyxtuyJ8WcGlljyDofO7y3lXfJHCuSvSELRUQBkCwA",
        "is_wishlisted": false,
        "category": {
            "slug": "elektronik",
            "name": "Elektronik"
        },
        "campus": {
            "slug": "unpad"
        },
        "seller": {
            "name": "Fajar R.",
            "ktm_verified": true
        }
    }
];
