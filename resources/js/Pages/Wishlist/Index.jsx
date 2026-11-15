import { Head, Link } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import ProductGrid from '@/Components/Product/ProductGrid';
import useProductActions from '@/Hooks/useProductActions';

// Setelah hati diklik, daftar dimuat ulang dari server (barang yang dilepas langsung hilang).
const REFRESH = ['products'];

function Pagination({ links, meta }) {
    if (meta.last_page <= 1) return null;

    const base =
        'flex h-10 items-center gap-1.5 rounded-xl border px-4 text-label-lg font-label-lg font-bold transition-colors';

    return (
        <nav aria-label="Halaman" className="mt-8 flex items-center justify-center gap-3">
            {links.prev ? (
                <Link
                    href={links.prev}
                    preserveScroll
                    className={`${base} border-outline-variant/60 bg-surface-container-lowest text-primary-container hover:bg-surface-container-low`}
                >
                    <Icon name="chevron-left" className="text-[12px]" />
                    Sebelumnya
                </Link>
            ) : (
                <span className={`${base} cursor-not-allowed border-transparent bg-surface-container text-outline`}>
                    <Icon name="chevron-left" className="text-[12px]" />
                    Sebelumnya
                </span>
            )}

            <span className="text-body-md font-body-md text-on-surface-variant">
                Halaman {meta.current_page} dari {meta.last_page}
            </span>

            {links.next ? (
                <Link
                    href={links.next}
                    preserveScroll
                    className={`${base} border-outline-variant/60 bg-surface-container-lowest text-primary-container hover:bg-surface-container-low`}
                >
                    Berikutnya
                    <Icon name="chevron-right" className="text-[12px]" />
                </Link>
            ) : (
                <span className={`${base} cursor-not-allowed border-transparent bg-surface-container text-outline`}>
                    Berikutnya
                    <Icon name="chevron-right" className="text-[12px]" />
                </span>
            )}
        </nav>
    );
}

/** Props dari WishlistController@index: products = { data: [ProductResource], meta, links } */
export default function Index({ products }) {
    const { toggleWishlist, addToCart } = useProductActions({ refresh: REFRESH });
    const { data, meta, links } = products;

    return (
        <MarketLayout>
            <Head title="Wishlist" />

            <div className="mx-auto w-full max-w-[1200px] px-margin-mobile pb-4 pt-6 md:px-margin">
                <div className="mb-5">
                    <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                        Wishlist
                    </h1>
                    <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                        {meta.total > 0
                            ? `${meta.total} barang yang kamu simpan.`
                            : 'Simpan barang incaranmu di sini supaya mudah ditemukan lagi.'}
                    </p>
                </div>

                {data.length === 0 ? (
                    <div className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-16 text-center">
                        <Icon name="heart" className="text-[36px] text-outline" />
                        <p className="mt-2 font-headline-sm text-headline-sm text-on-surface">Wishlist masih kosong</p>
                        <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                            Klik ikon hati di kartu barang untuk menyimpannya.
                        </p>
                        <Link
                            href="/"
                            className="mt-5 flex h-11 items-center gap-2 rounded-xl bg-primary-container px-6 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary"
                        >
                            <Icon name="search" className="text-[14px]" />
                            Cari barang
                        </Link>
                    </div>
                ) : (
                    <>
                        <ProductGrid products={data} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />
                        <Pagination links={links} meta={meta} />
                    </>
                )}
            </div>
        </MarketLayout>
    );
}
