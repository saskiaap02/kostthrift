import { Head, usePage } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Hero from '@/Components/Home/Hero';
import FilterBar from '@/Components/Home/FilterBar';
import TrustSection from '@/Components/Home/TrustSection';
import ProductGrid from '@/Components/Product/ProductGrid';
import Icon from '@/Components/UI/Icon';
import useProductFilters from '@/Hooks/useProductFilters';
import useProductFeed from '@/Hooks/useProductFeed';
import useProductActions from '@/Hooks/useProductActions';
import { heroImage } from '@/Data/assets';

/**
 * Props dari HomeController:
 *   products   { data: [ProductResource], meta }  halaman pertama katalog
 *   filters    { q, kondisi, kategori, kampus, urut }
 *   categories [{ slug, name, icon }]
 *   campuses   [{ slug, name, city, label, university: { slug, name, short_name } }]
 *
 * Tamu melihat landing (Hero + "Kenapa KosThrift"); user login langsung ke katalog.
 */
export default function Home({ products, filters: serverFilters, categories, campuses }) {
    const user = usePage().props.auth?.user;

    const { filters, update, reset, hasActiveFilters } = useProductFilters(serverFilters);
    const feed = useProductFeed(products, serverFilters);

    // Hati langsung berubah di layar (optimistik); server menyimpan di belakang layar.
    const { toggleWishlist, addToCart } = useProductActions({
        onWishlistChange: (product, next) => feed.patchItem(product.id, { is_wishlisted: next }),
    });

    const remaining = feed.total - feed.items.length;

    return (
        <MarketLayout>
            <Head title="Beranda" />

            {user ? (
                <section className="mx-auto w-full max-w-[1200px] px-margin-mobile pt-6 md:px-margin">
                    <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                        Halo, {user.name.split(' ')[0]}
                    </h1>
                    <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                        Temukan perlengkapan kos dari mahasiswa lain.
                    </p>
                </section>
            ) : (
                <Hero image={heroImage} />
            )}

            <FilterBar
                filters={filters}
                categories={categories}
                campuses={campuses}
                onChange={update}
                onReset={reset}
                hasActiveFilters={hasActiveFilters}
            />

            <section
                id="katalog"
                className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-margin-mobile pt-6 md:px-margin"
            >
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h2 className="font-headline-md text-headline-sm font-bold tracking-tight text-on-surface md:text-headline-md">
                            Katalog Pindahan Kos
                        </h2>
                        <p className="text-body-sm font-body-sm text-on-surface-variant md:text-body-md">
                            Langsung nego via chat atau COD di kampus
                        </p>
                    </div>
                    <span className="rounded-md bg-primary-fixed/40 px-2.5 py-1 text-label-md font-label-md font-bold text-primary-container">
                        {feed.total} Barang
                    </span>
                </div>

                <ProductGrid products={feed.items} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />

                {feed.hasMore && (
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={feed.loadMore}
                            disabled={feed.loading}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-low px-6 py-3 text-label-lg font-label-lg font-bold text-primary-container transition-colors hover:bg-surface-container active:scale-[0.98] disabled:opacity-60 md:w-auto"
                        >
                            {feed.loading && <Icon name="arrow-repeat" className="animate-spin text-[14px]" />}
                            {feed.loading ? 'Memuat...' : `Lihat ${remaining} Barang Lainnya`}
                        </button>
                    </div>
                )}
            </section>

            {!user && <TrustSection />}
        </MarketLayout>
    );
}
