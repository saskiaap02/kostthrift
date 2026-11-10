import { useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Hero from '@/Components/Home/Hero';
import FilterBar from '@/Components/Home/FilterBar';
import TrustSection from '@/Components/Home/TrustSection';
import ProductGrid from '@/Components/Product/ProductGrid';
import useProductFilters from '@/Hooks/useProductFilters';
import { campuses, categories, heroImage, products, totalProducts } from '@/Data/mockHome';

/**
 * Satu halaman, dua tampilan:
 * - Tamu (belum login): landing = Hero + katalog + "Kenapa KosThrift".
 * - User login: langsung sapaan singkat + katalog, tanpa banner.
 *
 * LANGKAH 3 - data masih mock (resources/js/Data/mockHome.js).
 * LANGKAH 4 - data berasal dari props Inertia (HomeController), filter di server.
 */
export default function Home() {
    const user = usePage().props.auth?.user;
    const { filters, update, reset, hasActiveFilters } = useProductFilters();

    // Sementara: filter + urut di sisi klien, hanya agar UI terasa hidup.
    const visibleProducts = useMemo(() => {
        const list = products.filter(
            (product) =>
                (!filters.kondisi || product.condition === filters.kondisi) &&
                (!filters.kategori || product.category.slug === filters.kategori) &&
                (!filters.kampus || product.campus.slug === filters.kampus),
        );

        return [...list].sort((a, b) =>
            filters.urut === 'termurah' ? a.price - b.price : b.id - a.id,
        );
    }, [filters]);

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
                        {totalProducts}+ Barang
                    </span>
                </div>

                <ProductGrid products={visibleProducts} />

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-low px-6 py-3 text-label-lg font-label-lg font-bold text-primary-container transition-colors hover:bg-surface-container active:scale-[0.98] md:w-auto"
                    >
                        Lihat 120+ Perlengkapan Kos Lainnya
                    </button>
                </div>
            </section>

            {!user && <TrustSection />}
        </MarketLayout>
    );
}
