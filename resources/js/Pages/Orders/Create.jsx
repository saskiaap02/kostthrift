import { Head, Link, useForm } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import VerifiedBadge from '@/Components/UI/VerifiedBadge';
import FormField, { textareaClass } from '@/Components/UI/FormField';
import { formatRupiah } from '@/Lib/format';

const METHODS = [
    {
        value: 'cod',
        icon: 'cash-coin',
        title: 'COD (bayar tunai saat bertemu)',
        text: 'Bertemu di kampus, periksa barang, lalu bayar tunai.',
    },
    {
        value: 'transfer',
        icon: 'bank',
        title: 'Transfer langsung ke penjual',
        text: 'Setelah penjual menyetujui, rekening atau e-wallet penjual tampil di pesananmu dan kamu mentransfer langsung ke sana.',
    },
];

/**
 * Props dari CheckoutController@show:
 *   seller            { id, name, ktm_verified }
 *   items             [ProductResource] barang tersedia dari penjual ini
 *   unavailable_count jumlah barang troli yang sudah tidak tersedia
 *   total             jumlah harga barang tersedia
 */
export default function Create({ seller, items, unavailable_count, total }) {
    const { data, setData, post, processing, errors } = useForm({
        seller_id: seller.id,
        payment_method: 'cod',
        buyer_note: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/pesanan', { preserveScroll: true });
    };

    return (
        <MarketLayout>
            <Head title="Checkout" />

            <div className="mx-auto w-full max-w-[1000px] px-margin-mobile pb-4 pt-6 md:px-margin">
                <Link
                    href="/troli"
                    className="mb-3 inline-flex items-center gap-1.5 text-label-lg font-label-lg font-bold text-primary-container hover:underline"
                >
                    <Icon name="arrow-left" className="text-[13px]" />
                    Kembali ke troli
                </Link>

                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Checkout
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-body-md font-body-md text-on-surface-variant">
                    Pesanan dari <strong className="text-on-surface">{seller.name}</strong>
                    {seller.ktm_verified && <VerifiedBadge />}
                </p>

                <form onSubmit={submit} className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-5">
                        <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-5">
                            <h2 className="mb-3 font-headline-sm text-body-lg font-bold text-on-surface">Cara pembayaran</h2>
                            <div role="radiogroup" aria-label="Cara pembayaran" className="space-y-3">
                                {METHODS.map((method) => {
                                    const active = data.payment_method === method.value;
                                    return (
                                        <label
                                            key={method.value}
                                            className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-colors ${
                                                active
                                                    ? 'border-primary-container bg-primary-fixed/20'
                                                    : 'border-outline-variant/50 hover:border-primary-container/50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.value}
                                                checked={active}
                                                onChange={() => setData('payment_method', method.value)}
                                                className="mt-1 h-4 w-4 border-outline text-primary-container focus:ring-primary-container"
                                            />
                                            <span className="min-w-0">
                                                <span className="flex items-center gap-2 text-label-lg font-label-lg font-bold text-on-surface">
                                                    <Icon name={method.icon} className="text-[15px] text-primary-container" />
                                                    {method.title}
                                                </span>
                                                <span className="mt-0.5 block text-body-sm font-body-sm text-on-surface-variant md:text-body-md">
                                                    {method.text}
                                                </span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.payment_method && (
                                <p role="alert" className="mt-2 text-body-sm font-body-sm font-semibold text-error">
                                    {errors.payment_method}
                                </p>
                            )}
                        </section>

                        <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-5">
                            <FormField
                                label="Catatan untuk penjual (opsional)"
                                htmlFor="buyer_note"
                                error={errors.buyer_note}
                                hint="Mis. waktu dan titik temu yang kamu inginkan. Belum ada fitur chat, jadi tulis di sini."
                            >
                                <textarea
                                    id="buyer_note"
                                    value={data.buyer_note}
                                    onChange={(event) => setData('buyer_note', event.target.value)}
                                    maxLength={300}
                                    className={textareaClass}
                                />
                            </FormField>
                        </section>

                        <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-5">
                            <h2 className="mb-3 font-headline-sm text-body-lg font-bold text-on-surface">Barang</h2>
                            <ul className="divide-y divide-outline-variant/30">
                                {items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                                            {item.image_url && (
                                                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 text-body-md font-body-md font-semibold text-on-surface">
                                                {item.title}
                                            </p>
                                            <p className="truncate text-body-sm font-body-sm text-outline">{item.location_label}</p>
                                        </div>
                                        <span className="font-headline-sm text-body-md font-bold tabular-nums text-primary">
                                            {formatRupiah(item.price)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {unavailable_count > 0 && (
                                <p className="mt-3 rounded-xl bg-orange-50 p-3 text-body-sm font-body-sm text-orange-900">
                                    {unavailable_count} barang lain dari penjual ini sudah tidak tersedia dan tidak ikut
                                    dipesan.
                                </p>
                            )}
                        </section>
                    </div>

                    <aside className="space-y-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-5 lg:sticky lg:top-24">
                        <h2 className="font-headline-md text-headline-sm font-bold text-on-surface">Ringkasan</h2>
                        <div className="flex items-center justify-between gap-4 border-t border-outline-variant/30 pt-3">
                            <span className="font-bold text-on-surface">Total</span>
                            <span className="font-headline-sm text-body-lg font-extrabold tabular-nums text-primary">
                                {formatRupiah(total)}
                            </span>
                        </div>

                        {(errors.seller_id || errors.order) && (
                            <p role="alert" className="rounded-xl bg-error/5 p-3 text-body-sm font-body-sm font-semibold text-error">
                                {errors.seller_id ?? errors.order}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary disabled:opacity-60"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Pesanan'}
                        </button>

                        <ul className="space-y-2 text-body-sm font-body-sm text-on-surface-variant">
                            <li className="flex items-start gap-2">
                                <Icon name="info-circle" className="mt-0.5 text-[13px] text-primary" />
                                Pesanan perlu disetujui penjual dulu.
                            </li>
                            <li className="flex items-start gap-2">
                                <Icon name="info-circle" className="mt-0.5 text-[13px] text-primary" />
                                Barang ditahan untukmu selama pesanan berjalan.
                            </li>
                            <li className="flex items-start gap-2">
                                <Icon name="info-circle" className="mt-0.5 text-[13px] text-primary" />
                                KosThrift tidak memproses pembayaran. Bayar langsung ke penjual.
                            </li>
                        </ul>
                    </aside>
                </form>
            </div>
        </MarketLayout>
    );
}
