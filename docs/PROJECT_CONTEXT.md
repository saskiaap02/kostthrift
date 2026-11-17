Berikut isi lengkap **`docs/PROJECT_CONTEXT.md`** yang sudah diperbarui (bagian 4, 6, 8, dan 9)—tinggal *copy* semua dan timpa isi file aslinya:

```markdown
# KosThrift: konteks proyek (BACA INI DULU)

Dokumen ini untuk anggota tim **dan asisten AI** yang membantu mengerjakan fitur. Perbarui dokumen ini setiap
kali ada fitur selesai atau keputusan baru.

## 1. Ringkasan produk
Marketplace jual beli perlengkapan kos **antar mahasiswa**. Pembeda utama: **penjual wajib terverifikasi KTM**
sebelum boleh memasang iklan. Pembayaran direncanakan dua pilihan: **COD** di kampus, atau **lewat payment
gateway berizin**. Proyek tugas kelompok; rencana deploy ke Vercel (lihat bagian 11).

## 2. Stack
- Laravel 12 (PHP 8.2+), Inertia.js + React **JavaScript (.jsx, bukan TypeScript)**, dari starter Breeze.
- Tailwind CSS **v3** (token desain dari Stitch ada di `stitch-theme.js`, dipakai di `tailwind.config.js`).
- Ikon: **Bootstrap Icons** lewat komponen `Icon` (`<Icon name="heart-fill" />`). Font: Plus Jakarta Sans.
- Database sesuai `.env` (jangan di-commit).

## 3. Aturan wajib (manusia dan AI)
1. **Modular.** Controller tipis. Validasi di **Form Request**. Logika kompleks di **Service** (`app/Services`).
   Bentuk data ke React lewat **API Resource** (`app/Http/Resources`), jangan kirim model mentah.
2. **Otorisasi lewat Policy** (`app/Policies`) atau middleware. Jangan hanya menyembunyikan tombol di UI.
3. **Teks UI berbahasa Indonesia.** Pesan validasi Indonesia (ada di Form Request dan `lang/id`).
4. **Tanpa emoji** di UI maupun data. Semua ikon Bootstrap Icons.
5. **Gaya:** pakai token Tailwind Stitch (`bg-primary-container`, `text-label-lg`, `font-body-md`, dan seterusnya),
   jangan warna hex acak. Contoh komponen: `Components/UI/FormField.jsx`, `Components/Product/ProductCard.jsx`.
6. **URL literal** di React (`'/produk/' + slug`), bukan helper `route()`.
7. **Jangan** pakai `localStorage` untuk data penting. Data dari server (props Inertia).
8. **Keamanan:** jangan pernah menyimpan file sensitif di disk `public`. Jangan log data pribadi. Jangan
   commit `.env`, kunci, atau password.
9. **Copy pembayaran:** KosThrift **tidak menahan, menerima, atau memproses uang pengguna**. Jangan menulis
   klaim seperti "rekber", "dana ditahan", "dana aman", "garansi", atau "jaminan". Pembayaran **final**: COD
   (tunai saat bertemu) atau transfer langsung ke rekening/e-wallet penjual. Payment gateway TIDAK dipakai
   (proyek tugas, tidak untuk publik).
10. **Akun admin hanya untuk moderasi.** Admin tidak berjualan, berbelanja, atau punya wishlist/troli
    (middleware `EnsureNotAdmin`). Halaman admin memakai `Layouts/AdminLayout.jsx`, bukan `MarketLayout`.

## 4. Struktur kode (dibuat otomatis, perbarui bila berubah)
Backend:

```

app/Console/Commands/ExpireOrders.php
app/Console/Commands/MakeAdmin.php
app/Enums/KtmVerificationStatus.php
app/Enums/OrderStatus.php
app/Enums/PaymentAccountType.php
app/Enums/PaymentMethod.php
app/Enums/ProductCondition.php
app/Enums/ProductStatus.php
app/Enums/SortOption.php
app/Enums/UserRole.php
app/Http/Controllers/CartController.php
app/Http/Controllers/CartItemController.php
app/Http/Controllers/CheckoutController.php
app/Http/Controllers/HomeController.php
app/Http/Controllers/InfoPageController.php
app/Http/Controllers/KtmVerificationController.php
app/Http/Controllers/MyProductController.php
app/Http/Controllers/OrderController.php
app/Http/Controllers/OrderTransitionController.php
app/Http/Controllers/PaymentAccountController.php
app/Http/Controllers/ProductController.php
app/Http/Controllers/ProductStatusController.php
app/Http/Controllers/WishlistController.php
app/Http/Controllers/Admin/DashboardController.php
app/Http/Controllers/Admin/KtmReviewController.php
app/Http/Controllers/Admin/ProductModerationController.php
app/Http/Controllers/Admin/UserDirectoryController.php
app/Http/Controllers/Auth/PasswordResetLinkController.php
app/Http/Controllers/Auth/RegisteredUserController.php
app/Http/Middleware/EnsureAdmin.php
app/Http/Middleware/EnsureKtmVerified.php
app/Http/Middleware/EnsureNotAdmin.php
app/Http/Requests/AcceptOrderRequest.php
app/Http/Requests/AdminListRequest.php
app/Http/Requests/AnalyzeProductPhotoRequest.php
app/Http/Requests/CancelOrderRequest.php
app/Http/Requests/HomeIndexRequest.php
app/Http/Requests/PlaceOrderRequest.php
app/Http/Requests/RejectKtmRequest.php
app/Http/Requests/ReportPaymentRequest.php
app/Http/Requests/StoreCartItemRequest.php
app/Http/Requests/StorePaymentAccountRequest.php
app/Http/Requests/StoreProductRequest.php
app/Http/Requests/SubmitKtmRequest.php
app/Http/Requests/UpdateProductRequest.php
app/Http/Requests/UpdateProductStatusRequest.php
app/Http/Requests/Auth/RegisterRequest.php
app/Http/Resources/AdminProductResource.php
app/Http/Resources/AdminUserResource.php
app/Http/Resources/CampusResource.php
app/Http/Resources/CategoryResource.php
app/Http/Resources/KtmVerificationResource.php
app/Http/Resources/MyProductResource.php
app/Http/Resources/OrderResource.php
app/Http/Resources/PaymentAccountResource.php
app/Http/Resources/ProductDetailResource.php
app/Http/Resources/ProductFormResource.php
app/Http/Resources/ProductResource.php
app/Models/Campus.php
app/Models/Category.php
app/Models/KtmVerification.php
app/Models/Order.php
app/Models/OrderItem.php
app/Models/PaymentAccount.php
app/Models/Product.php
app/Models/ProductImage.php
app/Models/University.php
app/Policies/KtmVerificationPolicy.php
app/Policies/OrderPolicy.php
app/Policies/ProductPolicy.php
app/Services/CartService.php
app/Services/KtmVerificationService.php
app/Services/OrderService.php
app/Services/ProductAiService.php
app/Services/ProductPublishingService.php
app/Services/ProductQueryService.php

```
Frontend (`resources/js`):

```

resources/js/Components/Home/FilterBar.jsx
resources/js/Components/Home/Hero.jsx
resources/js/Components/Home/TrustSection.jsx
resources/js/Components/Info/InfoPage.jsx
resources/js/Components/Layout/Footer.jsx
resources/js/Components/Layout/Logo.jsx
resources/js/Components/Layout/Navbar.jsx
resources/js/Components/Layout/SearchBar.jsx
resources/js/Components/Order/OrderStatusPill.jsx
resources/js/Components/Product/ImageLightbox.jsx
resources/js/Components/Product/ImagePicker.jsx
resources/js/Components/Product/ProductCard.jsx
resources/js/Components/Product/ProductForm.jsx
resources/js/Components/Product/ProductGallery.jsx
resources/js/Components/Product/ProductGrid.jsx
resources/js/Components/Product/WishlistButton.jsx
resources/js/Components/UI/CampusSelect.jsx
resources/js/Components/UI/ConditionBadge.jsx
resources/js/Components/UI/ConfirmDialog.jsx
resources/js/Components/UI/FormField.jsx
resources/js/Components/UI/Icon.jsx
resources/js/Components/UI/Pagination.jsx
resources/js/Components/UI/PasswordInput.jsx
resources/js/Components/UI/Price.jsx
resources/js/Components/UI/ReasonDialog.jsx
resources/js/Components/UI/Toast.jsx
resources/js/Components/UI/VerifiedBadge.jsx
resources/js/Data/assets.js
resources/js/Hooks/useClickOutside.js
resources/js/Hooks/useProductActions.js
resources/js/Hooks/useProductFeed.js
resources/js/Hooks/useProductFilters.js
resources/js/Layouts/AdminLayout.jsx
resources/js/Layouts/GuestLayout.jsx
resources/js/Layouts/MarketLayout.jsx
resources/js/Lib/format.js
resources/js/Lib/info.js
resources/js/Lib/query.js
resources/js/Pages/Home.jsx
resources/js/Pages/Admin/Dashboard.jsx
resources/js/Pages/Admin/Ktm/Index.jsx
resources/js/Pages/Admin/Products/Index.jsx
resources/js/Pages/Admin/Users/Index.jsx
resources/js/Pages/Auth/ForgotPassword.jsx
resources/js/Pages/Auth/Login.jsx
resources/js/Pages/Auth/Register.jsx
resources/js/Pages/Auth/ResetPassword.jsx
resources/js/Pages/Auth/VerifyEmail.jsx
resources/js/Pages/Cart/Index.jsx
resources/js/Pages/Info/Guide.jsx
resources/js/Pages/Info/Help.jsx
resources/js/Pages/Info/Meetup.jsx
resources/js/Pages/Info/Privacy.jsx
resources/js/Pages/Info/Terms.jsx
resources/js/Pages/Ktm/Show.jsx
resources/js/Pages/Orders/Create.jsx
resources/js/Pages/Orders/Index.jsx
resources/js/Pages/Orders/Show.jsx
resources/js/Pages/Products/Create.jsx
resources/js/Pages/Products/Edit.jsx
resources/js/Pages/Products/Mine.jsx
resources/js/Pages/Products/Show.jsx
resources/js/Pages/Settings/PaymentAccounts.jsx
resources/js/Pages/Wishlist/Index.jsx

```

## 5. Model data
| Tabel | Isi penting |
|---|---|
| `users` | name, email, `campus_id`, `ktm_verified_at` (terverifikasi bila terisi), `role` (user/admin) |
| `universities`, `campuses` | satu universitas punya banyak kampus (mis. Unsri: Indralaya dan Bukit) |
| `categories` | name, slug, `icon` (nama Bootstrap Icons) |
| `products` | seller_id, campus_id, category_id, title, slug, price, original_price, condition (baru/second), status (active/reserved/sold/draft), location_note; soft delete. `reserved` = ditahan pesanan yang sedang berjalan |
| `product_images` | path (URL penuh atau file di disk public), is_primary, sort_order |
| `wishlists`, `cart_items` | pivot user dan product (unik) |
| `payment_accounts` | rekening/e-wallet penjual; `account_number` TERENKRIPSI |
| `orders` | code (KT-XXXXXX), buyer_id, seller_id, status, payment_method (cod/transfer), total, catatan, `payment_snapshot` (salinan rekening, terenkripsi), `payment_proof_path` (privat), timestamp tiap tahap |
| `order_items` | salinan judul dan harga saat dipesan |
| `ktm_verifications` | user_id, university_id, status, `document_path` (PRIVAT, dihapus setelah diperiksa), reviewed_by |

Label lokasi produk: `location_note` + label kampus, mis. "Timbangan, Unsri Indralaya" (accessor `location_label`).

## 6. Route
| URL | Fungsi | Akses |
|---|---|---|
| `/` | Beranda (katalog, filter, cari) | publik |
| `/produk` (GET, JSON) | muat lebih banyak | publik |
| `/produk/{slug}` | detail produk | publik |
| `/jual`, `POST /produk`, `POST /produk/analisis-foto` | form, simpan iklan, dan isi otomatis dari foto (AI) | login + **KTM terverifikasi** |
| `/iklan-saya`, `/produk/{slug}/edit`, `PUT/DELETE /produk/{slug}`, `PATCH /produk/{slug}/status` | kelola iklan sendiri | login + pemilik |
| `/checkout/{id-penjual}`, `POST /pesanan` | checkout per penjual | login + **KTM terverifikasi** |
| `/pesanan`, `/pesanan/{kode}` (+ setujui, batalkan, lapor-bayar, konfirmasi-bayar, selesai, `bukti-bayar`) | pesanan pembeli dan penjual | login + pihak terkait |
| `/pengaturan/pembayaran` | rekening/e-wallet penjual | login |
| `/syarat-ketentuan`, `/kebijakan-privasi`, `/bantuan`, `/panduan-transaksi`, `/titik-temu-cod` | halaman informasi | publik |
| `/wishlist`, `POST /wishlist/{slug}` | wishlist | login |
| `/troli`, `POST /troli`, `DELETE /troli/{slug}` | troli | login |
| `/verifikasi-ktm`, `/verifikasi-ktm/{id}/dokumen` | unggah KTM, lihat foto | login (foto: pemilik/admin) |
| `/admin` | dashboard ringkasan | admin |
| `/admin/verifikasi-ktm` (+ setujui/tolak) | periksa KTM | admin |
| `/admin/iklan`, `DELETE /admin/iklan/{slug}` | tinjau dan turunkan iklan | admin |
| `/admin/pengguna` | daftar pengguna | admin |
| `/login`, `/register`, `/forgot-password`, `/reset-password`, dst. | Breeze (tema KosThrift) | tamu |

## 7. Pola Inertia yang dipakai
- Halaman: `resources/js/Pages/<Area>/<Nama>.jsx`; controller memanggil `Inertia::render('Area/Nama', [...])`.
- Daftar berpaginasi: `ProductResource::collection($paginator)` (prop berisi `data`, `meta`, `links`).
  Daftar tanpa paginasi: `Resource::collection(...)->resolve()` (array biasa).
- Aksi (wishlist, troli, dll.) memakai `router.post/delete` dengan `only: [...]` agar hanya prop tertentu yang
  dimuat ulang. Hook bersama: `Hooks/useProductActions.js`.
- Prop bersama (`HandleInertiaRequests`): `auth.user`, `counts` (wishlist, cart), `flash.success`, `errors`.
- `Components/UI/Toast.jsx` menampilkan `flash.success` dan `errors.product_id`.

## 8. Status fitur
**Selesai:** beranda + filter + cari, detail produk (galeri + zoom), jual/edit/hapus/tandai terjual, isi iklan
otomatis dari foto (AI), wishlist, troli, login/register (pilih kampus) + lupa/reset password, verifikasi KTM,
panel admin (dashboard, KTM, iklan, pengguna), halaman informasi, pesanan (COD dan transfer langsung) dengan
persetujuan penjual, upload bukti transfer, dan konfirmasi dua arah, rekening pembayaran penjual, pesanan
kedaluwarsa otomatis (`orders:expire`).

**Belum:** chat penjual-pembeli, ulasan/rating, notifikasi dalam aplikasi, profil (ubah kampus & etalase publik
penjual), laporan iklan & antrean moderasi admin, pemantauan pesanan di admin, test otomatis, deploy.

## 9. Keputusan produk (final)
- Penjual **dan pembeli** wajib terverifikasi KTM (pembeli sebelum checkout). Tanpa email kampus.
- Pembayaran: COD atau transfer langsung ke penjual. KosThrift tidak memproses uang.
- Alur pesanan: pembeli checkout (barang `reserved`) lalu penjual setuju/tolak lalu (transfer: pembeli lapor, penjual
  konfirmasi) lalu selesai (barang `sold`) atau batal (barang kembali `active`). Logika di `OrderService`.
- Rekening penjual baru terlihat pembeli setelah pesanan disetujui. Salinannya disimpan di pesanan.
- Data KTM: privat, hanya admin dan pemilik, dihapus setelah diperiksa, tidak dikirim ke layanan pihak ketiga.
- Fitur "isi iklan otomatis dari foto" (AI) di form Jual menggunakan Gemini API (`ProductAiService`). Foto produk
  dikirim ke penyedia AI, **foto KTM tidak pernah dikirim**.

## 10. Menjalankan di lokal
```bash
composer install && npm install
cp .env.example .env && php artisan key:generate   # atur DB & GEMINI_API_KEY di .env
php artisan migrate --seed
php artisan storage:link
npm run dev            # terminal 1
php artisan serve      # terminal 2

```

Akun demo (hanya lokal): pengguna `test@example.com` / `password` (sudah terverifikasi KTM);
admin `admin@kosthrift.test` / `password`. Admin untuk lingkungan lain: `php artisan kosthrift:make-admin email`.

## 11. Rencana deploy (Vercel) dan batasannya

* Runtime PHP komunitas untuk Vercel (`vercel-php`) sudah **diarsipkan** (Okt 2026). Jalur yang tersedia:
**Container Runtime (Beta)** dengan `Dockerfile.vercel` (FrankenPHP). Cek ulang dokumentasi Vercel sebelum mulai.
* Filesystem container **tidak permanen**: foto produk dan **foto KTM harus di object storage** (mis. S3-compatible),
bukan disk lokal. Atur `KTM_DISK` ke disk privat dan buat disk produk yang sesuai.
* Database harus di layanan eksternal. Queue worker dan scheduler tidak jalan seperti server biasa.
* `APP_ENV=production`, `APP_DEBUG=false`. Jangan jalankan seeder demo di produksi.

## 12. Kerja tim (Git)

* Satu fitur = satu branch (`fitur/chat`, `fitur/pesanan`). Gabung lewat Pull Request, jangan push langsung ke `main`.
* **File yang sering bentrok** (koordinasikan sebelum mengubah): `routes/web.php`, `Components/Layout/Navbar.jsx`,
`app/Http/Middleware/HandleInertiaRequests.php`, `database/seeders/DatabaseSeeder.php`.
* Migrasi baru: nama dengan tanggal terbaru, jangan mengedit migrasi yang sudah dipakai orang lain.
* Sebelum PR: jalankan `npm run build` dan coba fitur di browser.
* Pakai `docs/HANDOFF_TEMPLATE.md` untuk memberi tugas ke teman beserta AI-nya.

## 13. Checklist menambah fitur

1. Migrasi + Model (+ Factory/Seeder bila perlu). 2. Form Request. 3. Service (bila logika kompleks).
2. Policy/middleware. 5. Resource. 6. Controller tipis. 7. Route (tambahkan ke tabel bagian 6).
3. Halaman React + komponen. 9. Uji manual. 10. Perbarui dokumen ini (bagian 4, 5, 6, 8).

```

Setelah di-save (`Ctrl + S`), langsung `git add .`, `git commit`, dan `git push origin main`!

```