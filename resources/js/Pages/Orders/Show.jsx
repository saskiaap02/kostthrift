import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import VerifiedBadge from '@/Components/UI/VerifiedBadge';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import ReasonDialog from '@/Components/UI/ReasonDialog';
import OrderStatusPill from '@/Components/Order/OrderStatusPill';
import { inputClass, textareaClass } from '@/Components/UI/FormField';
import { formatRupiah, initials } from '@/Lib/format';

function buildSteps(order) {
    const t = order.timeline;
    const steps = [
        { label: 'Pesanan dibuat', at: order.created_at, done: true },
        { label: 'Disetujui penjual', at: t.accepted_at, done: Boolean(t.accepted_at) },
    ];

    if (order.payment_method === 'transfer') {
        steps.push(
            { label: 'Pembeli melapor sudah transfer', at: t.payment_reported_at, done: Boolean(t.payment_reported_at) },
            { label: 'Penjual mengonfirmasi uang masuk', at: t.paid_at, done: Boolean(t.paid_at) },
        );
    }

    steps.push({ label: 'Selesai', at: t.completed_at, done: Boolean(t.completed_at) });

    return steps;
}

function Card({ title, children }) {
    return (
        <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-5">
            {title && <h2 className="mb-3 font-headline-sm text-body-lg font-bold text-on-surface">{title}</h2>}
            {children}
        </section>
    );
}

function CopyNumber({ value }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard tidak tersedia: pengguna tetap bisa menyalin manual
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-outline-variant/60 px-2.5 text-label-md font-label-md font-bold text-primary-container hover:bg-surface-container-low"
        >
            <Icon name={copied ? 'check-lg' : 'clipboard'} className="text-[12px]" />
            {copied ? 'Tersalin' : 'Salin'}
        </button>
    );
}

function ReportPaymentDialog({ open, error, processing, onCancel, onSubmit }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    if (!open) return null;

    const handleFileChange = (event) => {
        const selected = event.target.files?.[0] ?? null;
        setFile(selected);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(selected ? URL.createObjectURL(selected) : null);
    };

    const handleClose = () => {
        if (preview) URL.revokeObjectURL(preview);
        setFile(null);
        setPreview(null);
        onCancel();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!file) return;
        onSubmit(file, () => {
            if (preview) URL.revokeObjectURL(preview);
            setFile(null);
            setPreview(null);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xl"
            >
                <h3 className="font-headline-sm text-body-lg font-bold text-on-surface">Unggah bukti transfer</h3>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Pastikan kamu sudah mentransfer ke rekening penjual, lalu unggah foto atau tangkapan layar bukti transfer (maks. 5 MB).
                </p>

                <div className="mt-4">
                    <label
                        htmlFor="payment_proof"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/70 bg-surface-container-low/50 p-4 text-center transition hover:border-primary-container"
                    >
                        {preview ? (
                            <img src={preview} alt="Pratinjau bukti transfer" className="max-h-52 rounded-lg object-contain" />
                        ) : (
                            <div className="py-3">
                                <Icon name="cloud-arrow-up" className="text-[26px] text-primary-container" />
                                <p className="mt-1.5 text-label-lg font-label-lg font-bold text-on-surface">
                                    Pilih foto bukti transfer
                                </p>
                                <p className="mt-0.5 text-body-sm font-body-sm text-outline">JPG, PNG, atau WebP</p>
                            </div>
                        )}
                        <input
                            id="payment_proof"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="sr-only"
                        />
                    </label>
                    {file && (
                        <p className="mt-1.5 truncate text-body-sm font-body-sm text-on-surface-variant">
                            File dipilih: <span className="font-semibold text-on-surface">{file.name}</span>
                        </p>
                    )}
                    {error && <p className="mt-1.5 text-body-sm font-body-sm font-semibold text-error">{error}</p>}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        disabled={processing}
                        onClick={handleClose}
                        className="h-10 rounded-xl border border-outline-variant/60 px-4 text-label-lg font-label-lg font-bold text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing || !file}
                        className="flex h-10 items-center gap-1.5 rounded-xl bg-primary-container px-4 text-label-lg font-label-lg font-bold text-white hover:bg-tertiary disabled:opacity-50"
                    >
                        <Icon name="send-check" className="text-[13px]" />
                        {processing ? 'Mengirim...' : 'Kirim bukti transfer'}
                    </button>
                </div>
            </form>
        </div>
    );
}

/**
 * Props dari OrderController@show:
 *   order             OrderResource (role, counterpart, items, payment_info, payment_proof_url, timeline, actions)
 *   payment_accounts  akun pembayaran penjual (kosong bila yang melihat adalah pembeli)
 */
export default function Show({ order, payment_accounts }) {
    const { errors } = usePage().props;
    const [dialog, setDialog] = useState(null); // 'cancel' | 'report' | 'confirm' | 'complete'
    const [busy, setBusy] = useState(false);
    const [accountId, setAccountId] = useState(payment_accounts[0]?.id ?? '');
    const [sellerNote, setSellerNote] = useState('');

    const isSeller = order.role === 'seller';
    const can = (action) => order.actions.includes(action);
    const steps = buildSteps(order);

    const send = (path, data = {}, onSuccessExtra = null) => {
        setBusy(true);
        router.post(`/pesanan/${order.code}/${path}`, data, {
            preserveScroll: true,
            forceFormData: data instanceof FormData || Boolean(data.payment_proof),
            onSuccess: () => {
                setDialog(null);
                if (onSuccessExtra) onSuccessExtra();
            },
            onFinish: () => setBusy(false),
        });
    };

    const needsAccount = order.payment_method === 'transfer';
    const cancelTitle = isSeller && order.status === 'pending' ? 'Tolak pesanan ini?' : 'Batalkan pesanan ini?';

    return (
        <MarketLayout>
            <Head title={`Pesanan ${order.code}`} />

            <div className="mx-auto w-full max-w-[1000px] px-margin-mobile pb-4 pt-6 md:px-margin">
                <Link
                    href={isSeller ? '/pesanan?peran=jual' : '/pesanan'}
                    className="mb-3 inline-flex items-center gap-1.5 text-label-lg font-label-lg font-bold text-primary-container hover:underline"
                >
                    <Icon name="arrow-left" className="text-[13px]" />
                    Kembali ke pesanan
                </Link>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                        {order.code}
                    </h1>
                    <OrderStatusPill status={order.status} label={order.status_label} />
                </div>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Dibuat {order.created_at} - {order.payment_method_label}
                </p>

                {(errors.order || errors.payment_account_id || errors.reason) && (
                    <p role="alert" className="mt-4 rounded-xl bg-error/5 p-3 text-body-md font-body-md font-semibold text-error">
                        {errors.order ?? errors.payment_account_id ?? errors.reason}
                    </p>
                )}

                <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-5">
                        {order.status === 'cancelled' && (
                            <p className="flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 p-4 text-body-md font-body-md text-error">
                                <Icon name="x-circle-fill" className="mt-0.5 text-[16px]" />
                                <span>
                                    Pesanan dibatalkan{order.cancel_reason ? `: ${order.cancel_reason}` : '.'}
                                </span>
                            </p>
                        )}

                        <Card title="Barang">
                            <ul className="divide-y divide-outline-variant/30">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                                            {item.image_url && (
                                                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            {item.slug ? (
                                                <Link
                                                    href={`/produk/${item.slug}`}
                                                    className="line-clamp-2 text-body-md font-body-md font-semibold text-on-surface hover:text-primary-container"
                                                >
                                                    {item.title}
                                                </Link>
                                            ) : (
                                                <p className="line-clamp-2 text-body-md font-body-md font-semibold text-on-surface">
                                                    {item.title}
                                                </p>
                                            )}
                                        </div>
                                        <span className="font-headline-sm text-body-md font-bold tabular-nums text-primary">
                                            {formatRupiah(item.price)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 flex items-center justify-between border-t border-outline-variant/30 pt-3">
                                <span className="font-bold text-on-surface">Total</span>
                                <span className="font-headline-sm text-body-lg font-extrabold tabular-nums text-primary">
                                    {formatRupiah(order.total)}
                                </span>
                            </div>
                        </Card>

                        {order.payment_info && (
                            <Card title="Transfer ke penjual">
                                <dl className="space-y-2.5 text-body-md font-body-md">
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-on-surface-variant">{order.payment_info.type_label}</dt>
                                        <dd className="font-semibold text-on-surface">{order.payment_info.provider}</dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-on-surface-variant">Atas nama</dt>
                                        <dd className="font-semibold text-on-surface">{order.payment_info.account_name}</dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <dt className="text-on-surface-variant">Nomor</dt>
                                        <dd className="flex items-center gap-2 font-semibold tabular-nums text-on-surface">
                                            {order.payment_info.account_number}
                                            <CopyNumber value={order.payment_info.account_number} />
                                        </dd>
                                    </div>
                                    <div className="flex justify-between gap-4 border-t border-outline-variant/30 pt-2.5">
                                        <dt className="font-bold text-on-surface">Jumlah</dt>
                                        <dd className="font-extrabold tabular-nums text-primary">{formatRupiah(order.total)}</dd>
                                    </div>
                                </dl>

                                {order.payment_proof_url && (
                                    <div className="mt-4 border-t border-outline-variant/30 pt-3.5">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-label-lg font-label-lg font-bold text-on-surface">
                                                Bukti transfer dari pembeli
                                            </span>
                                            <a
                                                href={order.payment_proof_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-label-md font-label-md font-bold text-primary-container hover:underline"
                                            >
                                                <Icon name="box-arrow-up-right" className="text-[11px]" />
                                                Buka ukuran penuh
                                            </a>
                                        </div>
                                        <a
                                            href={order.payment_proof_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low"
                                        >
                                            <img
                                                src={order.payment_proof_url}
                                                alt="Bukti transfer pembayaran"
                                                className="max-h-64 w-full object-contain"
                                            />
                                        </a>
                                    </div>
                                )}

                                <p className="mt-3 flex items-start gap-2 rounded-xl bg-orange-50 p-3 text-body-sm font-body-sm text-orange-900">
                                    <Icon name="exclamation-triangle-fill" className="mt-0.5 text-[13px]" />
                                    Transfer hanya ke rekening di atas, dan simpan bukti transfermu. KosThrift tidak
                                    memproses pembayaran dan tidak dapat mengembalikan uang.
                                </p>
                            </Card>
                        )}

                        {(order.buyer_note || order.seller_note) && (
                            <Card title="Catatan">
                                <dl className="space-y-3 text-body-md font-body-md">
                                    {order.buyer_note && (
                                        <div>
                                            <dt className="text-body-sm font-body-sm text-on-surface-variant">Dari pembeli</dt>
                                            <dd className="whitespace-pre-line text-on-surface">{order.buyer_note}</dd>
                                        </div>
                                    )}
                                    {order.seller_note && (
                                        <div>
                                            <dt className="text-body-sm font-body-sm text-on-surface-variant">
                                                Dari penjual (titik temu / waktu)
                                            </dt>
                                            <dd className="whitespace-pre-line text-on-surface">{order.seller_note}</dd>
                                        </div>
                                    )}
                                </dl>
                            </Card>
                        )}

                        {order.actions.length > 0 && (
                            <Card title="Tindakan">
                                {can('accept') && (
                                    <div className="space-y-3">
                                        <p className="text-body-md font-body-md text-on-surface-variant">
                                            Periksa profil pembeli, lalu setujui atau tolak pesanan ini.
                                        </p>

                                        {needsAccount && (
                                            <div>
                                                <label htmlFor="account" className="mb-1.5 block text-label-lg font-label-lg font-bold text-on-surface">
                                                    Terima pembayaran di
                                                </label>
                                                {payment_accounts.length > 0 ? (
                                                    <select
                                                        id="account"
                                                        value={accountId}
                                                        onChange={(event) => setAccountId(event.target.value)}
                                                        className={`${inputClass} pr-9`}
                                                    >
                                                        {payment_accounts.map((account) => (
                                                            <option key={account.id} value={account.id}>
                                                                {account.provider} - {account.masked_number} ({account.account_name})
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <p className="rounded-xl bg-orange-50 p-3 text-body-md font-body-md text-orange-900">
                                                        Kamu belum punya rekening atau e-wallet.{' '}
                                                        <Link href="/pengaturan/pembayaran" className="font-bold underline">
                                                            Tambahkan dulu
                                                        </Link>{' '}
                                                        untuk menyetujui pesanan transfer.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="seller_note" className="mb-1.5 block text-label-lg font-label-lg font-bold text-on-surface">
                                                Catatan untuk pembeli (opsional)
                                            </label>
                                            <textarea
                                                id="seller_note"
                                                value={sellerNote}
                                                onChange={(event) => setSellerNote(event.target.value)}
                                                maxLength={300}
                                                placeholder="Mis. titik temu dan waktu yang kamu usulkan"
                                                className={textareaClass}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            disabled={busy || (needsAccount && payment_accounts.length === 0)}
                                            onClick={() =>
                                                send('setujui', { payment_account_id: needsAccount ? accountId : null, seller_note: sellerNote })
                                            }
                                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-label-lg font-label-lg font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            <Icon name="check-lg" className="text-[14px]" />
                                            Setujui pesanan
                                        </button>
                                    </div>
                                )}

                                <div className={`flex flex-wrap gap-2 ${can('accept') ? 'mt-3' : ''}`}>
                                    {can('report_payment') && (
                                        <button
                                            type="button"
                                            onClick={() => setDialog('report')}
                                            className="flex h-11 items-center gap-2 rounded-xl bg-primary-container px-5 text-label-lg font-label-lg font-bold text-white hover:bg-tertiary"
                                        >
                                            <Icon name="send-check" className="text-[14px]" />
                                            Saya sudah transfer
                                        </button>
                                    )}
                                    {can('confirm_payment') && (
                                        <button
                                            type="button"
                                            onClick={() => setDialog('confirm')}
                                            className="flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-label-lg font-label-lg font-bold text-white hover:bg-emerald-700"
                                        >
                                            <Icon name="cash-coin" className="text-[14px]" />
                                            Uang sudah masuk
                                        </button>
                                    )}
                                    {can('complete') && (
                                        <button
                                            type="button"
                                            onClick={() => setDialog('complete')}
                                            className="flex h-11 items-center gap-2 rounded-xl bg-primary-container px-5 text-label-lg font-label-lg font-bold text-white hover:bg-tertiary"
                                        >
                                            <Icon name="check2-circle" className="text-[14px]" />
                                            {isSeller ? 'Barang sudah diserahkan' : 'Barang sudah diterima'}
                                        </button>
                                    )}
                                    {can('cancel') && (
                                        <button
                                            type="button"
                                            onClick={() => setDialog('cancel')}
                                            className="flex h-11 items-center gap-2 rounded-xl border border-error/40 px-5 text-label-lg font-label-lg font-bold text-error hover:bg-error/5"
                                        >
                                            <Icon name="x-lg" className="text-[12px]" />
                                            {isSeller && order.status === 'pending' ? 'Tolak' : 'Batalkan'}
                                        </button>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>

                    <aside className="space-y-5">
                        <Card title={isSeller ? 'Pembeli' : 'Penjual'}>
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-lg font-label-lg font-bold text-white">
                                    {initials(order.counterpart.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-headline-sm text-body-lg font-bold text-on-surface">
                                        {order.counterpart.name}
                                    </p>
                                    {order.counterpart.ktm_verified && <VerifiedBadge className="mt-0.5" />}
                                </div>
                            </div>
                            <ul className="mt-3 space-y-1.5 text-body-md font-body-md text-on-surface-variant">
                                <li className="flex items-center gap-2">
                                    <Icon name="geo-alt" className="text-[13px] text-outline" />
                                    {order.counterpart.campus ?? 'Kampus belum dipilih'}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Icon name="calendar3" className="text-[13px] text-outline" />
                                    Bergabung {order.counterpart.joined}
                                </li>
                            </ul>
                            {order.counterpart?.id && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post('/pesan/mulai', {
                                            recipient_id: order.counterpart.id,
                                        })
                                    }
                                    className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-primary-container/40 bg-primary-fixed/30 text-label-lg font-label-lg font-bold text-primary-container transition-colors hover:bg-primary-fixed/60"
                                >
                                    <Icon name="chat-dots" className="text-[15px]" />
                                    <span>{isSeller ? 'Chat Pembeli' : 'Chat Penjual'}</span>
                                </button>
                            )}
                        </Card>

                        <Card title="Perkembangan">
                            <ol className="space-y-3">
                                {steps.map((step) => (
                                    <li key={step.label} className="flex items-start gap-2.5">
                                        <Icon
                                            name={step.done ? 'check-circle-fill' : 'circle'}
                                            className={`mt-0.5 text-[15px] ${step.done ? 'text-emerald-600' : 'text-outline-variant'}`}
                                        />
                                        <div>
                                            <p
                                                className={`text-body-md font-body-md ${
                                                    step.done ? 'font-semibold text-on-surface' : 'text-on-surface-variant'
                                                }`}
                                            >
                                                {step.label}
                                            </p>
                                            {step.done && step.at && (
                                                <p className="text-body-sm font-body-sm text-outline">{step.at}</p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {order.status === 'cancelled' && (
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="x-circle-fill" className="mt-0.5 text-[15px] text-error" />
                                        <div>
                                            <p className="text-body-md font-body-md font-semibold text-error">Dibatalkan</p>
                                            <p className="text-body-sm font-body-sm text-outline">{order.timeline.cancelled_at}</p>
                                        </div>
                                    </li>
                                )}
                            </ol>
                        </Card>
                    </aside>
                </div>
            </div>

            <ReasonDialog
                open={dialog === 'cancel'}
                title={cancelTitle}
                description="Barang akan dibuka kembali untuk pembeli lain. Tulis alasanmu."
                placeholder="Mis. sudah tidak jadi beli, barang sudah terjual di tempat lain."
                confirmLabel={isSeller && order.status === 'pending' ? 'Tolak pesanan' : 'Batalkan pesanan'}
                error={errors.reason}
                processing={busy}
                onCancel={() => setDialog(null)}
                onSubmit={(reason) => send('batalkan', { reason })}
            />

            <ReportPaymentDialog
                open={dialog === 'report'}
                error={errors.payment_proof}
                processing={busy}
                onCancel={() => setDialog(null)}
                onSubmit={(file, resetFile) => send('lapor-bayar', { payment_proof: file }, resetFile)}
            />

            <ConfirmDialog
                open={dialog === 'confirm'}
                title="Uang sudah masuk?"
                message="Konfirmasi hanya jika uang benar-benar sudah masuk ke rekening atau e-wallet-mu."
                confirmLabel="Ya, sudah masuk"
                processing={busy}
                onConfirm={() => send('konfirmasi-bayar')}
                onCancel={() => setDialog(null)}
            />

            <ConfirmDialog
                open={dialog === 'complete'}
                title="Tandai pesanan selesai?"
                message={
                    isSeller
                        ? 'Pastikan barang sudah kamu serahkan kepada pembeli.'
                        : 'Pastikan barang sudah kamu terima dan sesuai.'
                }
                confirmLabel="Ya, selesai"
                processing={busy}
                onConfirm={() => send('selesai')}
                onCancel={() => setDialog(null)}
            />
        </MarketLayout>
    );
}