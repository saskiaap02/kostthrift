import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import Pagination from '@/Components/UI/Pagination';
import OrderStatusPill from '@/Components/Order/OrderStatusPill';
import ImageLightbox from '@/Components/Product/ImageLightbox';
import { cleanFilters } from '@/Lib/query';
import { formatRupiah } from '@/Lib/format';

/**
 * Props dari Admin\OrderMonitorController@index:
 *   orders    { data: [AdminOrderResource], meta, links }
 *   filters   { q, status }
 *   statuses  [{ value, label }]
 */
export default function Index({ orders, filters, statuses }) {
    const [query, setQuery] = useState(filters.q);
    const [proof, setProof] = useState(null);

    const visit = (next) =>
        router.get('/admin/pesanan', cleanFilters(next), { preserveState: true, preserveScroll: true });

    const tabs = [{ value: '', label: 'Semua' }, ...statuses];

    return (
        <AdminLayout>
            <Head title="Pesanan (Admin)" />

            <div className="w-full max-w-[1000px]">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Pesanan
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Pantau semua transaksi beserta statusnya. Admin hanya melihat, tidak mengubah pesanan.
                </p>

                <form
                    role="search"
                    onSubmit={(event) => {
                        event.preventDefault();
                        visit({ ...filters, q: query.trim() });
                    }}
                    className="mt-5 flex w-full items-stretch overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest md:w-96"
                >
                    <label htmlFor="order-search" className="sr-only">
                        Cari pesanan
                    </label>
                    <input
                        id="order-search"
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cari kode, nama, atau email"
                        className="min-w-0 flex-1 border-none bg-transparent px-3 py-2.5 text-body-md font-body-md ring-0 placeholder:text-outline focus:outline-none focus:ring-0"
                    />
                    <button type="submit" aria-label="Cari" className="bg-primary-container px-4 text-white hover:bg-tertiary">
                        <Icon name="search" className="text-[14px]" />
                    </button>
                </form>

                <div role="tablist" aria-label="Status pesanan" className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {tabs.map((tab) => {
                        const active = filters.status === tab.value;
                        return (
                            <button
                                key={tab.value || 'semua'}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => visit({ ...filters, status: tab.value })}
                                className={`h-9 shrink-0 rounded-full px-4 text-label-md font-label-md transition-colors ${
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

                {orders.data.length === 0 ? (
                    <p className="mt-6 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-12 text-center text-body-md font-body-md text-on-surface-variant">
                        Tidak ada pesanan yang cocok.
                    </p>
                ) : (
                    <ul className="mt-5 divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                        {orders.data.map((order) => (
                            <li key={order.code} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-body-md font-bold text-on-surface">{order.code}</span>
                                        <OrderStatusPill status={order.status} label={order.status_label} />
                                        <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-sm font-label-sm font-bold text-on-surface-variant">
                                            {order.payment_method_label}
                                        </span>
                                    </div>
                                    <p className="mt-1 truncate text-body-sm font-body-sm text-on-surface-variant">
                                        {order.items.join(', ') || 'Tanpa barang'}
                                    </p>
                                    <p className="mt-0.5 truncate text-body-sm font-body-sm text-on-surface-variant">
                                        Pembeli <strong className="font-semibold text-on-surface">{order.buyer.name}</strong>
                                        {' → '}
                                        Penjual <strong className="font-semibold text-on-surface">{order.seller.name}</strong>
                                    </p>
                                    <p className="text-body-sm font-body-sm text-outline">
                                        Dibuat {order.created_at}
                                        {order.payment_reported_at && ` · bukti dikirim ${order.payment_reported_at}`}
                                    </p>
                                    {order.cancel_reason && (
                                        <p className="mt-0.5 text-body-sm font-body-sm text-error">
                                            Dibatalkan: {order.cancel_reason}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="w-28 text-right font-headline-sm text-body-md font-bold tabular-nums text-primary">
                                        {formatRupiah(order.total)}
                                    </span>
                                    {order.payment_proof_url ? (
                                        <button
                                            type="button"
                                            onClick={() => setProof(order)}
                                            className="flex h-9 items-center gap-1.5 rounded-lg border border-outline-variant/60 px-3 text-label-md font-label-md font-bold text-primary-container hover:bg-surface-container-low"
                                        >
                                            <Icon name="image" className="text-[13px]" />
                                            Bukti transfer
                                        </button>
                                    ) : (
                                        <span className="flex h-9 w-[132px] items-center justify-center text-label-sm font-label-sm text-outline">
                                            {order.payment_method === 'transfer' ? 'Belum ada bukti' : '-'}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <Pagination links={orders.links} meta={orders.meta} />
            </div>

            {proof && (
                <ImageLightbox
                    images={[{ id: proof.code, url: proof.payment_proof_url }]}
                    index={0}
                    onIndexChange={() => {}}
                    onClose={() => setProof(null)}
                    title={`Bukti transfer ${proof.code}`}
                />
            )}
        </AdminLayout>
    );
}
