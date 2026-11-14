import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import ConditionBadge from '@/Components/UI/ConditionBadge';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { formatRupiah } from '@/Lib/format';

const TABS = [
    { value: '', label: 'Semua', key: 'all' },
    { value: 'active', label: 'Aktif', key: 'active' },
    { value: 'sold', label: 'Terjual', key: 'sold' },
];

const actionClass =
    'flex h-9 items-center gap-1.5 rounded-lg border border-outline-variant/50 px-3 text-label-md font-label-md font-bold transition-colors';

function StatusPill({ status, label }) {
    const styles = {
        active: 'bg-emerald-500/15 text-emerald-700',
        sold: 'bg-surface-container text-on-surface-variant',
        draft: 'bg-amber-500/15 text-amber-700',
    };

    return (
        <span className={`rounded-full px-2 py-0.5 text-label-sm font-label-sm font-bold ${styles[status] ?? styles.draft}`}>
            {label}
        </span>
    );
}

function ListingRow({ product, onSold, onActivate, onDelete }) {
    const sold = product.status === 'sold';

    return (
        <article className="flex flex-col gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center">
            <Link
                href={`/produk/${product.slug}`}
                className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-container-low text-outline"
            >
                {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
                ) : (
                    <Icon name="image" className="text-[24px]" />
                )}
            </Link>

            <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                    <StatusPill status={product.status} label={product.status_label} />
                    <ConditionBadge condition={product.condition} label={product.condition_label} />
                </div>
                <Link
                    href={`/produk/${product.slug}`}
                    className="line-clamp-2 font-headline-sm text-body-lg font-bold text-on-surface hover:text-primary-container"
                >
                    {product.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <span className="font-headline-sm text-body-lg font-bold tabular-nums text-primary">
                        {formatRupiah(product.price)}
                    </span>
                    {product.original_price && (
                        <span className="text-body-sm tabular-nums text-outline line-through">
                            {formatRupiah(product.original_price)}
                        </span>
                    )}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm font-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                        <Icon name="geo-alt-fill" className="text-[11px]" />
                        {product.location_label}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon name="clock" className="text-[11px]" />
                        {product.posted_at}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon name="heart" className="text-[11px]" />
                        {product.wishlist_count} disimpan
                    </span>
                </p>
            </div>

            <div className="flex flex-wrap gap-2 md:w-[230px] md:justify-end">
                <Link
                    href={`/produk/${product.slug}/edit`}
                    className={`${actionClass} bg-surface-container-lowest text-primary-container hover:bg-surface-container-low`}
                >
                    <Icon name="pencil-square" className="text-[13px]" />
                    Edit
                </Link>

                {sold ? (
                    <button
                        type="button"
                        onClick={() => onActivate(product)}
                        className={`${actionClass} bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low`}
                    >
                        <Icon name="arrow-counterclockwise" className="text-[13px]" />
                        Aktifkan lagi
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onSold(product)}
                        className={`${actionClass} bg-surface-container-lowest text-emerald-700 hover:bg-emerald-50`}
                    >
                        <Icon name="check2-circle" className="text-[13px]" />
                        Tandai terjual
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onDelete(product)}
                    aria-label={`Hapus ${product.title}`}
                    className={`${actionClass} bg-surface-container-lowest text-error hover:bg-error/5`}
                >
                    <Icon name="trash3" className="text-[13px]" />
                    Hapus
                </button>
            </div>
        </article>
    );
}

/**
 * Props dari MyProductController@index:
 *   products      { data: [MyProductResource], links, meta }
 *   filters       { status: '' | 'active' | 'sold' }
 *   statusCounts  { all, active, sold }
 */
export default function Mine({ products, filters, statusCounts }) {
    const [dialog, setDialog] = useState(null); // { type: 'sold' | 'delete', product }
    const [processing, setProcessing] = useState(false);

    const close = () => setDialog(null);

    const changeStatus = (product, status, options = {}) =>
        router.patch(`/produk/${product.slug}/status`, { status }, { preserveScroll: true, ...options });

    const confirm = () => {
        const { type, product } = dialog;
        const options = {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                close();
            },
        };

        if (type === 'delete') {
            router.delete(`/produk/${product.slug}`, options);
        } else {
            changeStatus(product, 'sold', options);
        }
    };

    const empty = products.data.length === 0;

    return (
        <MarketLayout>
            <Head title="Iklan Saya" />

            <div className="mx-auto w-full max-w-[1000px] px-margin-mobile pb-6 pt-6 md:px-margin">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                            Iklan Saya
                        </h1>
                        <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                            Kelola barang yang kamu jual.
                        </p>
                    </div>
                    <Link
                        href="/jual"
                        className="flex h-11 items-center gap-1.5 rounded-xl bg-secondary-container px-5 text-label-lg font-label-lg font-bold text-primary shadow-sm transition-colors hover:bg-secondary-fixed"
                    >
                        <Icon name="plus-lg" className="text-[14px]" />
                        Jual Barang
                    </Link>
                </div>

                <div role="tablist" aria-label="Filter status iklan" className="mb-4 flex flex-wrap gap-2">
                    {TABS.map((tab) => {
                        const active = filters.status === tab.value;
                        return (
                            <Link
                                key={tab.key}
                                href={tab.value ? `/iklan-saya?status=${tab.value}` : '/iklan-saya'}
                                role="tab"
                                aria-selected={active}
                                preserveScroll
                                className={`flex h-10 items-center gap-2 rounded-full px-4 text-label-lg font-label-lg transition-colors ${
                                    active
                                        ? 'bg-primary-container font-bold text-white shadow-sm'
                                        : 'border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary-container hover:text-primary-container'
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`rounded-full px-1.5 text-[11px] font-bold tabular-nums ${
                                        active ? 'bg-white/20' : 'bg-surface-container'
                                    }`}
                                >
                                    {statusCounts[tab.key]}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {empty ? (
                    <div className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-16 text-center">
                        <Icon name="box-seam" className="text-[36px] text-outline" />
                        <p className="mt-2 font-headline-sm text-headline-sm text-on-surface">
                            {filters.status ? 'Tidak ada iklan dengan status ini' : 'Kamu belum memasang iklan'}
                        </p>
                        <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                            {filters.status
                                ? 'Coba pilih tab lain.'
                                : 'Punya perlengkapan kos yang tidak terpakai? Jual ke sesama mahasiswa.'}
                        </p>
                        {!filters.status && (
                            <Link
                                href="/jual"
                                className="mt-4 flex h-11 items-center gap-1.5 rounded-xl bg-primary-container px-5 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary"
                            >
                                <Icon name="plus-lg" className="text-[14px]" />
                                Pasang iklan pertama
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {products.data.map((product) => (
                            <ListingRow
                                key={product.id}
                                product={product}
                                onSold={(item) => setDialog({ type: 'sold', product: item })}
                                onActivate={(item) => changeStatus(item, 'active')}
                                onDelete={(item) => setDialog({ type: 'delete', product: item })}
                            />
                        ))}
                    </div>
                )}

                {products.meta.last_page > 1 && (
                    <nav aria-label="Halaman" className="mt-6 flex items-center justify-between">
                        {products.links.prev ? (
                            <Link
                                href={products.links.prev}
                                preserveScroll
                                className="flex h-10 items-center gap-1.5 rounded-xl border border-outline-variant/60 px-4 text-label-lg font-label-lg font-bold text-primary-container hover:bg-surface-container-low"
                            >
                                <Icon name="chevron-left" className="text-[12px]" />
                                Sebelumnya
                            </Link>
                        ) : (
                            <span />
                        )}
                        <span className="text-body-md font-body-md text-on-surface-variant">
                            Halaman {products.meta.current_page} dari {products.meta.last_page}
                        </span>
                        {products.links.next ? (
                            <Link
                                href={products.links.next}
                                preserveScroll
                                className="flex h-10 items-center gap-1.5 rounded-xl border border-outline-variant/60 px-4 text-label-lg font-label-lg font-bold text-primary-container hover:bg-surface-container-low"
                            >
                                Berikutnya
                                <Icon name="chevron-right" className="text-[12px]" />
                            </Link>
                        ) : (
                            <span />
                        )}
                    </nav>
                )}
            </div>

            <ConfirmDialog
                open={dialog?.type === 'delete'}
                tone="danger"
                title="Hapus iklan ini?"
                message={`"${dialog?.product.title}" tidak akan tampil lagi di KosThrift. Tindakan ini tidak bisa dibatalkan dari aplikasi.`}
                confirmLabel="Ya, hapus"
                processing={processing}
                onConfirm={confirm}
                onCancel={close}
            />
            <ConfirmDialog
                open={dialog?.type === 'sold'}
                title="Tandai sudah terjual?"
                message={`"${dialog?.product.title}" tidak akan muncul di Beranda lagi. Kamu bisa mengaktifkannya kembali kapan saja.`}
                confirmLabel="Ya, tandai terjual"
                processing={processing}
                onConfirm={confirm}
                onCancel={close}
            />
        </MarketLayout>
    );
}
