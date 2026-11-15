import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import ImageLightbox from '@/Components/Product/ImageLightbox';
import { textareaClass } from '@/Components/UI/FormField';

function RejectDialog({ target, processing, error, onCancel, onSubmit }) {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (target) setReason('');
    }, [target]);

    if (!target) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Tolak pengajuan"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
            onClick={(event) => event.target === event.currentTarget && onCancel()}
        >
            <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
                <h2 className="font-headline-md text-headline-sm font-bold text-on-surface">
                    Tolak pengajuan {target.user.name}?
                </h2>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Tulis alasan agar mahasiswa tahu apa yang harus diperbaiki. Foto KTM akan dihapus permanen.
                </p>
                <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    maxLength={200}
                    placeholder="Mis. Foto buram, nama tidak terbaca, atau KTM sudah kedaluwarsa."
                    className={`${textareaClass} mt-4`}
                />
                {error && <p className="mt-1.5 text-body-sm font-body-sm font-semibold text-error">{error}</p>}
                <div className="mt-5 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-11 rounded-xl border border-outline-variant/60 px-5 text-label-lg font-label-lg font-bold text-on-surface-variant hover:bg-surface-container-low"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => onSubmit(reason)}
                        className="h-11 rounded-xl bg-error px-5 text-label-lg font-label-lg font-bold text-white hover:opacity-90 disabled:opacity-60"
                    >
                        {processing ? 'Memproses...' : 'Tolak'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Meta({ icon, children }) {
    return (
        <li className="flex items-center gap-2 text-body-md font-body-md text-on-surface-variant">
            <Icon name={icon} className="text-[13px] text-outline" />
            {children}
        </li>
    );
}

/**
 * Props dari Admin\KtmReviewController@index:
 *   pending  [KtmVerificationResource]  antrean pemeriksaan (terlama di atas)
 *   history  [KtmVerificationResource]  20 keputusan terakhir
 */
export default function Index({ pending, history }) {
    const { errors } = usePage().props;
    const [viewing, setViewing] = useState(null);
    const [approving, setApproving] = useState(null);
    const [rejecting, setRejecting] = useState(null);
    const [busy, setBusy] = useState(false);

    const act = (path, data, done) => {
        setBusy(true);
        router.post(path, data, {
            preserveScroll: true,
            onSuccess: done,
            onFinish: () => setBusy(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Verifikasi KTM (Admin)" />

            <div className="w-full max-w-[1000px]">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Verifikasi KTM
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Cocokkan nama di KTM dengan nama akun, serta universitas dan masa berlaku. Foto dihapus otomatis
                    setelah kamu memutuskan.
                </p>

                {errors?.verification && (
                    <p role="alert" className="mt-4 rounded-xl bg-error/5 p-3 text-body-md font-body-md font-semibold text-error">
                        {errors.verification}
                    </p>
                )}

                <section className="mt-6">
                    <h2 className="mb-3 flex items-center gap-2 font-headline-md text-headline-sm font-bold text-on-surface">
                        Menunggu pemeriksaan
                        <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-label-md font-label-md text-white">
                            {pending.length}
                        </span>
                    </h2>

                    {pending.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-12 text-center text-body-md font-body-md text-on-surface-variant">
                            Tidak ada pengajuan yang menunggu.
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {pending.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-headline-sm text-body-lg font-bold text-on-surface">
                                            {item.user.name}
                                        </p>
                                        <ul className="mt-1.5 space-y-1">
                                            <Meta icon="envelope">{item.user.email}</Meta>
                                            <Meta icon="mortarboard">{item.university}</Meta>
                                            <Meta icon="clock">Dikirim {item.submitted_at}</Meta>
                                        </ul>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setViewing(item)}
                                            className="flex h-10 items-center gap-1.5 rounded-xl border border-outline-variant/60 px-4 text-label-lg font-label-lg font-bold text-primary-container hover:bg-surface-container-low"
                                        >
                                            <Icon name="zoom-in" className="text-[14px]" />
                                            Lihat KTM
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setApproving(item)}
                                            className="flex h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-label-lg font-label-lg font-bold text-white hover:bg-emerald-700"
                                        >
                                            <Icon name="check-lg" className="text-[14px]" />
                                            Setujui
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRejecting(item)}
                                            className="flex h-10 items-center gap-1.5 rounded-xl border border-error/40 px-4 text-label-lg font-label-lg font-bold text-error hover:bg-error/5"
                                        >
                                            <Icon name="x-lg" className="text-[12px]" />
                                            Tolak
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-10">
                    <h2 className="mb-3 font-headline-md text-headline-sm font-bold text-on-surface">Riwayat terbaru</h2>

                    {history.length === 0 ? (
                        <p className="text-body-md font-body-md text-on-surface-variant">Belum ada keputusan.</p>
                    ) : (
                        <ul className="divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                            {history.map((item) => (
                                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-body-md font-body-md font-semibold text-on-surface">
                                            {item.user.name}
                                            <span className="ml-2 font-normal text-on-surface-variant">{item.university}</span>
                                        </p>
                                        {item.rejection_reason && (
                                            <p className="text-body-sm font-body-sm text-error">{item.rejection_reason}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-label-sm font-label-sm font-bold ${
                                                item.status === 'approved'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-error/10 text-error'
                                            }`}
                                        >
                                            {item.status_label}
                                        </span>
                                        <span>oleh {item.reviewer ?? '-'}, {item.reviewed_at}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            {viewing && (
                <ImageLightbox
                    images={[{ id: viewing.id, url: `/verifikasi-ktm/${viewing.id}/dokumen` }]}
                    index={0}
                    onIndexChange={() => {}}
                    onClose={() => setViewing(null)}
                    title={`KTM ${viewing.user.name}`}
                />
            )}

            <ConfirmDialog
                open={Boolean(approving)}
                title="Setujui verifikasi?"
                message={`${approving?.user.name} akan ditandai sebagai mahasiswa terverifikasi dan foto KTM-nya dihapus.`}
                confirmLabel="Ya, setujui"
                processing={busy}
                onConfirm={() => act(`/admin/verifikasi-ktm/${approving.id}/setujui`, {}, () => setApproving(null))}
                onCancel={() => setApproving(null)}
            />

            <RejectDialog
                target={rejecting}
                processing={busy}
                error={errors?.reason}
                onCancel={() => setRejecting(null)}
                onSubmit={(reason) => act(`/admin/verifikasi-ktm/${rejecting.id}/tolak`, { reason }, () => setRejecting(null))}
            />
        </AdminLayout>
    );
}
