import { Head, Link, router } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import ConditionBadge from '@/Components/UI/ConditionBadge';
import VerifiedBadge from '@/Components/UI/VerifiedBadge';
import { formatRupiah, initials } from '@/Lib/format';

function CartItem({ product, onRemove }) {
    const sold = product.status === 'sold';
    const href = `/produk/${product.slug}`;

    return (
        <li className="flex gap-3 py-4 first:pt-0 last:pb-0">
            <Link
                href={href}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-container-low"
                aria-label={`Lihat ${product.title}`}
            >
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.title}
                        className={`h-full w-full object-cover ${sold ? 'opacity-50 grayscale' : ''}`}
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center text-outline">
                        <Icon name="image" className="text-[24px]" />
                    </span>
                )}
            </Link>

            <div className="min-w-0 flex-1">
                <Link
                    href={href}
                    className="line-clamp-2 font-headline-sm text-body-md font-semibold leading-tight text-on-surface hover:text-primary-container"
                >
                    {product.title}
                </Link>

                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {sold ? (
                        <span className="rounded-full bg-on-surface/80 px-2 py-0.5 text-label-sm font-label-sm font-bold text-white">
                            Terjual
                        </span>
                    ) : (
                        <ConditionBadge condition={product.condition} label={product.condition_label} />
                    )}
                    <span className="flex items-center gap-1 text-body-sm font-body-sm text-outline">
                        <Icon name="geo-alt-fill" className="text-[11px]" />
                        {product.location_label}
                    </span>
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                    <span
                        className={`font-headline-sm text-body-lg font-bold tabular-nums ${
                            sold ? 'text-outline line-through' : 'text-primary'
                        }`}
                    >
                        {formatRupiah(product.price)}
                    </span>
                    {product.original_price && !sold && (
                        <span className="text-body-sm tabular-nums text-outline line-through">
                            {formatRupiah(product.original_price)}
                        </span>
                    )}
                </div>

                {sold && (
                    <p className="mt-1 text-body-sm font-body-sm font-semibold text-error">
                        Barang ini sudah terjual. Hapus dari troli.
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={() => onRemove(product)}
                aria-label={`Hapus ${product.title} dari troli`}
                className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-lg text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
            >
                <Icon name="trash3" className="text-[16px]" />
            </button>
        </li>
    );
}

/**
 * Props dari CartController@index:
 *   groups   [{ seller: { id, name, ktm_verified }, items: [ProductResource], subtotal, available_count }]
 *   summary  { items, available, amount }
 */
export default function Index({ groups, summary }) {
    const remove = (product) => {
        router.delete(`/troli/${product.slug}`, {
            preserveScroll: true,
            only: ['groups', 'summary', 'counts', 'flash'],
        });
    };

    const hasSold = summary.items > summary.available;

    return (
        <MarketLayout>
            <Head title="Troli" />

            <div className="mx-auto w-full max-w-[1200px] px-margin-mobile pb-4 pt-6 md:px-margin">
                <div className="mb-5">
                    <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                        Troli
                    </h1>
                    <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                        {summary.items > 0
                            ? `${summary.items} barang dari ${groups.length} penjual.`
                            : 'Belum ada barang di troli.'}
                    </p>
                </div>

                {groups.length === 0 ? (
                    <div className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-16 text-center">
                        <Icon name="bag" className="text-[36px] text-outline" />
                        <p className="mt-2 font-headline-sm text-headline-sm text-on-surface">Troli kosong</p>
                        <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                            Tambahkan barang dengan tombol Troli di kartu atau halaman detail.
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
                    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="space-y-5">
                            {groups.map((group) => (
                                <section
                                    key={group.seller.id}
                                    className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-5"
                                >
                                    <div className="mb-4 flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-md font-label-md font-bold text-white">
                                            {initials(group.seller.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-headline-sm text-body-lg font-bold text-on-surface">
                                                {group.seller.name}
                                            </p>
                                            {group.seller.ktm_verified && <VerifiedBadge className="mt-0.5" />}
                                        </div>
                                    </div>

                                    <ul className="divide-y divide-outline-variant/30">
                                        {group.items.map((product) => (
                                            <CartItem key={product.id} product={product} onRemove={remove} />
                                        ))}
                                    </ul>

                                    <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-3">
                                        <span className="text-body-md font-body-md text-on-surface-variant">
                                            Subtotal ({group.available_count} barang tersedia)
                                        </span>
                                        <span className="font-headline-sm text-body-lg font-bold tabular-nums text-on-surface">
                                            {formatRupiah(group.subtotal)}
                                        </span>
                                    </div>
                                </section>
                            ))}
                        </div>

                        <aside className="space-y-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-5 lg:sticky lg:top-24">
                            <h2 className="font-headline-md text-headline-sm font-bold text-on-surface md:text-headline-md">
                                Ringkasan Troli
                            </h2>

                            <dl className="space-y-2.5 text-body-md font-body-md">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-on-surface-variant">Barang tersedia</dt>
                                    <dd className="font-semibold text-on-surface">
                                        {summary.available} dari {summary.items}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4 border-t border-outline-variant/30 pt-2.5">
                                    <dt className="font-bold text-on-surface">Total</dt>
                                    <dd className="font-headline-sm text-body-lg font-extrabold tabular-nums text-primary">
                                        {formatRupiah(summary.amount)}
                                    </dd>
                                </div>
                            </dl>

                            {hasSold && (
                                <p className="flex items-start gap-2 rounded-xl bg-error/5 p-3 text-body-sm font-body-sm text-error">
                                    <Icon name="exclamation-triangle-fill" className="mt-0.5 text-[13px]" />
                                    <span>Ada barang yang sudah terjual dan tidak ikut dihitung. Hapus dari troli.</span>
                                </p>
                            )}

                            <button
                                type="button"
                                disabled
                                className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-surface-container text-label-lg font-label-lg font-bold text-on-surface-variant"
                            >
                                <Icon name="lock" className="text-[14px]" />
                                Lanjut ke Pembayaran
                            </button>
                            <p className="text-center text-body-sm font-body-sm text-on-surface-variant">
                                Checkout segera hadir.
                            </p>

                            <p className="flex items-start gap-2 rounded-xl bg-surface-container-low/70 p-3 text-body-sm font-body-sm text-on-surface-variant">
                                <Icon name="info-circle" className="mt-0.5 text-[13px] text-primary" />
                                <span>
                                    Barang bekas hanya 1 unit, jadi bisa terjual ke pembeli lain sebelum kamu
                                    checkout.
                                </span>
                            </p>
                        </aside>
                    </div>
                )}
            </div>
        </MarketLayout>
    );
}
