import { Head, Link, router, usePage } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import ConditionBadge from '@/Components/UI/ConditionBadge';
import VerifiedBadge from '@/Components/UI/VerifiedBadge';
import ProductGallery from '@/Components/Product/ProductGallery';
import ProductGrid from '@/Components/Product/ProductGrid';
import useProductActions from '@/Hooks/useProductActions';
import { formatRupiah, initials } from '@/Lib/format';

// Prop yang dimuat ulang setelah wishlist/troli (server = sumber kebenaran).
const REFRESH = ['product', 'related'];

const ASSURANCES = [
    { icon: 'shield-lock', text: 'Penjual dan pembeli adalah mahasiswa yang sudah diverifikasi KTM.' },
    { icon: 'geo-alt', text: 'COD di titik ramai kampus, tanpa ongkir.' },
    { icon: 'search', text: 'Cek barang langsung sebelum membayar.' },
];

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between gap-4 border-b border-outline-variant/30 py-2.5 last:border-0">
            <dt className="text-body-md font-body-md text-on-surface-variant">{label}</dt>
            <dd className="text-right text-body-md font-body-md font-semibold text-on-surface">{value}</dd>
        </div>
    );
}

function Actions({ product, isAdmin, onCart, onWishlist }) {
    if (isAdmin) {
        return (
            <div className="space-y-3 rounded-xl bg-surface-container p-4">
                <p className="flex items-start gap-2 text-body-md font-body-md text-on-surface-variant">
                    <Icon name="shield-check" className="mt-0.5 text-[16px]" />
                    <span>Kamu melihat halaman ini sebagai admin. Aksi pembeli dinonaktifkan.</span>
                </p>
                <Link
                    href="/admin/iklan"
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-container px-4 text-label-lg font-label-lg font-bold text-white hover:bg-tertiary"
                >
                    <Icon name="card-list" className="text-[14px]" />
                    Kelola di Panel Admin
                </Link>
            </div>
        );
    }

    if (product.is_owner) {
        return (
            <div className="space-y-3 rounded-xl bg-primary-fixed/30 p-4">
                <p className="flex items-start gap-2 text-body-md font-body-md text-primary">
                    <Icon name="info-circle" className="mt-0.5 text-[16px]" />
                    <span>Ini iklan milikmu. Pembeli akan melihat tombol troli dan wishlist di sini.</span>
                </p>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={`/produk/${product.slug}/edit`}
                        className="flex h-10 items-center gap-1.5 rounded-xl bg-primary-container px-4 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary"
                    >
                        <Icon name="pencil-square" className="text-[14px]" />
                        Edit Iklan
                    </Link>
                    <Link
                        href="/iklan-saya"
                        className="flex h-10 items-center gap-1.5 rounded-xl border border-primary-container/30 bg-surface-container-lowest px-4 text-label-lg font-label-lg font-bold text-primary-container transition-colors hover:bg-surface-container-low"
                    >
                        <Icon name="box-seam" className="text-[14px]" />
                        Iklan Saya
                    </Link>
                </div>
            </div>
        );
    }

    if (product.status !== 'active') {
        return (
            <div className="flex items-center gap-2 rounded-xl bg-surface-container p-4 text-body-md font-body-md font-semibold text-on-surface-variant">
                <Icon name="check-circle-fill" className="text-[16px]" />
                <span>
                    {product.status === 'reserved'
                        ? 'Barang ini sedang dipesan pembeli lain.'
                        : 'Barang ini sudah terjual.'}
                </span>
            </div>
        );
    }

    return (
        <div className="flex gap-3">
            <button
                type="button"
                onClick={onCart}
                disabled={product.in_cart}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary active:scale-[0.98] disabled:cursor-default disabled:bg-surface-container disabled:text-on-surface-variant disabled:active:scale-100"
            >
                <Icon name={product.in_cart ? 'bag-check' : 'bag-plus'} className="text-[18px]" />
                {product.in_cart ? 'Sudah di Troli' : 'Tambah ke Troli'}
            </button>
            <button
                type="button"
                onClick={onWishlist}
                aria-pressed={product.is_wishlisted}
                aria-label={product.is_wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors active:scale-95 ${
                    product.is_wishlisted
                        ? 'border-error/40 bg-error/5 text-error'
                        : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-error/40 hover:text-error'
                }`}
            >
                <Icon name={product.is_wishlisted ? 'heart-fill' : 'heart'} className="text-[18px]" />
            </button>
        </div>
    );
}

/**
 * Props dari ProductController@show:
 *   product  ProductDetailResource (lengkap dengan images, seller, campus)
 *   related  [ProductResource] barang lain di kampus/kategori yang sama
 */
export default function Show({ product, related }) {
    const authUser = usePage().props.auth?.user;
    const isAdmin = authUser?.role === 'admin';
    const { toggleWishlist, addToCart } = useProductActions(REFRESH);


    const handleAskSeller = () => {
        if (!authUser) {
            router.visit('/login');
            return;
        }
        router.post('/pesan/mulai', {
            recipient_id: product.seller.id,
            product_slug: product.slug,
        });
    };

    return (
        <MarketLayout>
            <Head title={product.title} />

            <div className="mx-auto w-full max-w-[1200px] px-margin-mobile pb-4 pt-5 md:px-margin">
                <Link
                    href="/"
                    className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-3.5 py-1.5 text-label-lg font-label-lg font-bold text-primary-container transition-colors hover:bg-surface-container-low"
                >
                    <Icon name="arrow-left" className="text-[13px]" />
                    Kembali ke Beranda
                </Link>

                <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
                    <Link href="/" className="hover:text-primary">
                        Beranda
                    </Link>
                    <Icon name="chevron-right" className="text-[10px]" />
                    <Link href={`/?kategori=${product.category.slug}`} className="hover:text-primary">
                        {product.category.name}
                    </Link>
                    <Icon name="chevron-right" className="text-[10px]" />
                    <span className="truncate font-semibold text-on-surface">{product.title}</span>
                </nav>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                    <ProductGallery images={product.images} title={product.title} />

                    <div className="space-y-5">
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <ConditionBadge condition={product.condition} label={product.condition_label} />
                                {product.status !== 'active' && (
                                    <span className="rounded-full bg-surface-container px-2 py-0.5 text-label-sm font-label-sm font-bold text-on-surface-variant">
                                        {product.status_label}
                                    </span>
                                )}
                            </div>
                            <h1 className="font-headline-lg text-headline-md font-extrabold leading-tight text-on-surface md:text-headline-lg">
                                {product.title}
                            </h1>

                            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span className="font-headline-lg text-[28px] font-extrabold leading-none tabular-nums text-primary">
                                    {formatRupiah(product.price)}
                                </span>
                                {product.original_price && (
                                    <span className="text-body-md tabular-nums text-outline line-through">
                                        {formatRupiah(product.original_price)}
                                    </span>
                                )}
                                {product.discount_percent && (
                                    <span className="rounded-md bg-secondary-container px-2 py-0.5 text-label-md font-label-md font-bold text-on-secondary-container">
                                        Hemat {product.discount_percent}%
                                    </span>
                                )}
                            </div>

                            <ul className="mt-3 space-y-1.5 text-body-md font-body-md text-on-surface-variant">
                                <li className="flex items-center gap-2">
                                    <Icon name="geo-alt-fill" className="text-[14px] text-primary-container" />
                                    {product.location_label}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Icon name="clock" className="text-[14px] text-primary-container" />
                                    Diposting {product.posted_at}
                                </li>
                            </ul>
                        </div>

                        <Actions
                            product={product}
                            isAdmin={isAdmin}
                            onCart={() => addToCart(product)}
                            onWishlist={() => toggleWishlist(product)}
                        />

                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-lg font-label-lg font-bold text-white">
                                    {initials(product.seller.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-headline-sm text-body-lg font-bold text-on-surface">
                                        {product.seller.name}
                                    </p>
                                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                                        Bergabung sejak {product.seller.member_since}
                                    </p>
                                    {product.seller.ktm_verified && <VerifiedBadge className="mt-1" />}
                                </div>
                            </div>

                            {!isAdmin && !product.is_owner && (
                                <button
                                    type="button"
                                    onClick={handleAskSeller}
                                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-primary-container/40 bg-primary-fixed/30 px-3.5 text-label-lg font-label-lg font-bold text-primary-container transition-colors hover:bg-primary-fixed/60 active:scale-95"
                                >
                                    <Icon name="chat-dots" className="text-[15px]" />
                                    <span>Tanya Penjual</span>
                                </button>
                            )}
                        </div>

                        <ul className="space-y-2 rounded-2xl bg-surface-container-low/70 p-4">
                            {ASSURANCES.map((item) => (
                                <li
                                    key={item.icon}
                                    className="flex items-start gap-2.5 text-body-sm font-body-sm text-on-surface-variant md:text-body-md"
                                >
                                    <Icon name={item.icon} className="mt-0.5 text-[15px] text-primary" />
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <section>
                        <h2 className="mb-3 font-headline-md text-headline-sm font-bold text-on-surface md:text-headline-md">
                            Deskripsi
                        </h2>
                        <p className="whitespace-pre-line text-body-md font-body-md leading-relaxed text-on-surface-variant">
                            {product.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-headline-md text-headline-sm font-bold text-on-surface md:text-headline-md">
                            Rincian
                        </h2>
                        <dl className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-4">
                            <DetailRow label="Kondisi" value={product.condition_label} />
                            <DetailRow label="Kategori" value={product.category.name} />
                            <DetailRow label="Universitas" value={product.campus.university} />
                            <DetailRow label="Kampus" value={product.campus.label} />
                            <DetailRow label="Kota" value={`${product.campus.city}, ${product.campus.province}`} />
                        </dl>
                    </section>
                </div>

                {related.length > 0 && (
                    <section className="mt-12">
                        <h2 className="mb-3 font-headline-md text-headline-sm font-bold text-on-surface md:text-headline-md">
                            Barang Lain di Sekitar Ini
                        </h2>
                        <ProductGrid products={related} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />
                    </section>
                )}
            </div>
        </MarketLayout>
    );
}
