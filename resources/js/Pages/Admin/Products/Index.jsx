import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import Pagination from '@/Components/UI/Pagination';
import { cleanFilters } from '@/Lib/query';
import { formatRupiah } from '@/Lib/format';

const TABS = [
    { value: '', label: 'Semua' },
    { value: 'active', label: 'Aktif' },
    { value: 'sold', label: 'Terjual' },
];

/**
 * Props dari Admin\ProductModerationController@index:
 *   products  { data: [AdminProductResource], meta, links }
 *   filters   { q, status }
 */
export default function Index({ products, filters }) {
    const [query, setQuery] = useState(filters.q);
    const [target, setTarget] = useState(null);
    const [busy, setBusy] = useState(false);

    const visit = (next) =>
        router.get('/admin/iklan', cleanFilters(next), { preserveState: true, preserveScroll: true });

    const takeDown = () => {
        setBusy(true);
        router.delete(`/admin/iklan/${target.slug}`, {
            preserveScroll: true,
            onSuccess: () => setTarget(null),
            onFinish: () => setBusy(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Iklan (Admin)" />

            <div className="w-full max-w-[1000px]">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Iklan
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Tinjau semua iklan dan turunkan yang melanggar aturan.
                </p>

                <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div role="tablist" aria-label="Status iklan" className="flex gap-2">
                        {TABS.map((tab) => {
                            const active = filters.status === tab.value;
                            return (
                                <button
                                    key={tab.value || 'semua'}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => visit({ ...filters, status: tab.value })}
                                    className={`h-10 rounded-full px-5 text-label-lg font-label-lg transition-colors ${
                                        active
                                            ? 'bg-primary-container font-bold text-white'
                                            : 'border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary-container'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <form
                        role="search"
                        onSubmit={(event) => {
                            event.preventDefault();
                            visit({ ...filters, q: query.trim() });
                        }}
                        className="flex w-full items-stretch overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest md:w-80"
                    >
                        <label htmlFor="admin-search" className="sr-only">
                            Cari iklan
                        </label>
                        <input
                            id="admin-search"
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari judul atau deskripsi"
                            className="min-w-0 flex-1 border-none bg-transparent px-3 py-2.5 text-body-md font-body-md ring-0 placeholder:text-outline focus:outline-none focus:ring-0"
                        />
                        <button
                            type="submit"
                            aria-label="Cari"
                            className="bg-primary-container px-4 text-white hover:bg-tertiary"
                        >
                            <Icon name="search" className="text-[14px]" />
                        </button>
                    </form>
                </div>

                {products.data.length === 0 ? (
                    <p className="mt-6 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-12 text-center text-body-md font-body-md text-on-surface-variant">
                        Tidak ada iklan yang cocok.
                    </p>
                ) : (
                    <ul className="mt-5 divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                        {products.data.map((product) => (
                            <li key={product.id} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                                        {product.image_url && (
                                            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-body-md font-body-md font-semibold text-on-surface">
                                            {product.title}
                                        </p>
                                        <p className="truncate text-body-sm font-body-sm text-on-surface-variant">
                                            {product.seller.name} - {product.location_label}
                                        </p>
                                        <p className="text-body-sm font-body-sm text-outline">{product.posted_at}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="w-28 text-right font-headline-sm text-body-md font-bold tabular-nums text-primary">
                                        {formatRupiah(product.price)}
                                    </span>
                                    <span
                                        className={`w-16 rounded-full px-2.5 py-0.5 text-center text-label-sm font-label-sm font-bold ${
                                            product.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-surface-container text-on-surface-variant'
                                        }`}
                                    >
                                        {product.status_label}
                                    </span>
                                    <Link
                                        href={`/produk/${product.slug}`}
                                        className="flex h-9 items-center rounded-lg border border-outline-variant/60 px-3 text-label-md font-label-md font-bold text-primary-container hover:bg-surface-container-low"
                                    >
                                        Lihat
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setTarget(product)}
                                        className="flex h-9 items-center gap-1 rounded-lg border border-error/40 px-3 text-label-md font-label-md font-bold text-error hover:bg-error/5"
                                    >
                                        <Icon name="trash3" className="text-[13px]" />
                                        Turunkan
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <Pagination links={products.links} meta={products.meta} />
            </div>

            <ConfirmDialog
                open={Boolean(target)}
                title="Turunkan iklan ini?"
                message={`"${target?.title}" akan disembunyikan dari katalog.`}
                confirmLabel="Ya, turunkan"
                tone="danger"
                processing={busy}
                onConfirm={takeDown}
                onCancel={() => setTarget(null)}
            />
        </AdminLayout>
    );
}
