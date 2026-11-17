import { Head, Link } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import Pagination from '@/Components/UI/Pagination';
import OrderStatusPill from '@/Components/Order/OrderStatusPill';
import { formatRupiah } from '@/Lib/format';

/**
 * Props dari OrderController@index:
 *   orders  { data: [OrderResource], meta, links }
 *   role    'beli' | 'jual'
 *   tally   { beli, jual, perlu_tindakan }
 */
export default function Index({ orders, role, tally }) {
    const tabs = [
        { key: 'beli', label: 'Pembelian', href: '/pesanan', count: tally.beli },
        { key: 'jual', label: 'Penjualan', href: '/pesanan?peran=jual', count: tally.jual, alert: tally.perlu_tindakan },
    ];

    return (
        <MarketLayout>
            <Head title="Pesanan" />

            <div className="mx-auto w-full max-w-[1000px] px-margin-mobile pb-4 pt-6 md:px-margin">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Pesanan
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Pantau pesanan yang kamu buat dan pesanan yang masuk ke iklanmu.
                </p>

                <div role="tablist" aria-label="Jenis pesanan" className="mt-5 flex gap-2">
                    {tabs.map((tab) => {
                        const active = role === tab.key;
                        return (
                            <Link
                                key={tab.key}
                                href={tab.href}
                                role="tab"
                                aria-selected={active}
                                className={`flex h-10 items-center gap-2 rounded-full px-5 text-label-lg font-label-lg transition-colors ${
                                    active
                                        ? 'bg-primary-container font-bold text-white'
                                        : 'border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary-container'
                                }`}
                            >
                                {tab.label}
                                <span className={`rounded-full px-2 text-label-sm ${active ? 'bg-white/20' : 'bg-surface-container'}`}>
                                    {tab.count}
                                </span>
                                {tab.alert > 0 && (
                                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                                        {tab.alert}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {orders.data.length === 0 ? (
                    <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-14 text-center">
                        <Icon name="receipt" className="text-[34px] text-outline" />
                        <p className="mt-2 font-headline-sm text-headline-sm text-on-surface">
                            {role === 'jual' ? 'Belum ada pesanan masuk' : 'Belum ada pesanan'}
                        </p>
                        {role === 'beli' && (
                            <Link
                                href="/"
                                className="mt-4 flex h-11 items-center gap-2 rounded-xl bg-primary-container px-6 text-label-lg font-label-lg font-bold text-white hover:bg-tertiary"
                            >
                                <Icon name="search" className="text-[14px]" />
                                Cari barang
                            </Link>
                        )}
                    </div>
                ) : (
                    <ul className="mt-5 space-y-3">
                        {orders.data.map((order) => {
                            const first = order.items[0];
                            const more = order.items.length - 1;
                            return (
                                <li key={order.code}>
                                    <Link
                                        href={`/pesanan/${order.code}`}
                                        className="flex items-center gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                                            {first?.image_url && (
                                                <img src={first.image_url} alt="" className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-headline-sm text-body-md font-bold text-on-surface">
                                                    {order.code}
                                                </span>
                                                <OrderStatusPill status={order.status} label={order.status_label} />
                                            </div>
                                            <p className="mt-1 truncate text-body-md font-body-md text-on-surface">
                                                {first?.title}
                                                {more > 0 && (
                                                    <span className="text-on-surface-variant"> dan {more} barang lainnya</span>
                                                )}
                                            </p>
                                            <p className="truncate text-body-sm font-body-sm text-on-surface-variant">
                                                {order.role === 'seller' ? 'Pembeli' : 'Penjual'}: {order.counterpart.name} -{' '}
                                                {order.created_at}
                                            </p>
                                        </div>
                                        <span className="shrink-0 font-headline-sm text-body-lg font-bold tabular-nums text-primary">
                                            {formatRupiah(order.total)}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <Pagination links={orders.links} meta={orders.meta} />
            </div>
        </MarketLayout>
    );
}
