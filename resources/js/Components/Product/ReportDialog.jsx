import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';
import { textareaClass } from '@/Components/UI/FormField';

/**
 * Dialog "Laporkan Iklan": pilih alasan pelanggaran + keterangan tambahan.
 * Dikirim ke POST /produk/{slug}/laporan (ReportController@store).
 *
 * Props:
 *   open, onClose
 *   product   { slug, title }
 *   reasons   [{ value, label }]  dari ReportReason::options()
 */
export default function ReportDialog({ open, onClose, product, reasons }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        reason: '',
        detail: '',
    });

    useEffect(() => {
        if (open) {
            reset();
            clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'Escape' && !processing) onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, processing, onClose]);

    if (!open) return null;

    const submit = (event) => {
        event.preventDefault();
        post(`/produk/${product.slug}/laporan`, {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-on-surface/50 p-4"
            onClick={(event) => {
                if (event.target === event.currentTarget && !processing) onClose();
            }}
        >
            <form
                onSubmit={submit}
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-surface-container-lowest p-6 shadow-xl"
            >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-error/10 text-error">
                    <Icon name="flag-fill" className="text-[20px]" />
                </div>
                <h2 id="report-title" className="font-headline-md text-headline-sm font-bold text-on-surface">
                    Laporkan iklan ini
                </h2>
                <p className="mt-1 truncate text-body-md font-body-md text-on-surface-variant">{product.title}</p>

                <fieldset className="mt-4">
                    <legend className="mb-2 text-label-lg font-label-lg font-bold text-on-surface">
                        Apa masalahnya?
                    </legend>
                    <div className="space-y-2">
                        {reasons.map((reason) => {
                            const selected = data.reason === reason.value;
                            return (
                                <label
                                    key={reason.value}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-body-md font-body-md transition-colors ${
                                        selected
                                            ? 'border-primary-container bg-primary-fixed/30 font-semibold text-on-surface'
                                            : 'border-outline-variant/60 text-on-surface-variant hover:border-primary-container'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={reason.value}
                                        checked={selected}
                                        onChange={() => setData('reason', reason.value)}
                                        className="h-4 w-4 border-outline text-primary-container focus:ring-primary-container/30"
                                    />
                                    {reason.label}
                                </label>
                            );
                        })}
                    </div>
                    {errors.reason && (
                        <p role="alert" className="mt-1.5 text-body-sm font-body-sm font-semibold text-error">
                            {errors.reason}
                        </p>
                    )}
                </fieldset>

                <div className="mt-4">
                    <label htmlFor="report-detail" className="mb-1.5 block text-label-lg font-label-lg font-bold text-on-surface">
                        Keterangan{' '}
                        <span className="font-normal text-on-surface-variant">
                            {data.reason === 'other' ? '(wajib)' : '(opsional)'}
                        </span>
                    </label>
                    <textarea
                        id="report-detail"
                        value={data.detail}
                        onChange={(event) => setData('detail', event.target.value)}
                        maxLength={300}
                        placeholder="Ceritakan singkat apa yang kamu temukan."
                        className={`${textareaClass} !min-h-[96px]`}
                    />
                    {errors.detail && (
                        <p role="alert" className="mt-1.5 text-body-sm font-body-sm font-semibold text-error">
                            {errors.detail}
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="h-10 rounded-xl border border-outline-variant/60 px-4 text-label-lg font-label-lg font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-60"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex h-10 items-center gap-2 rounded-xl bg-error px-4 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-error/90 disabled:opacity-60"
                    >
                        {processing && <Icon name="arrow-repeat" className="animate-spin text-[13px]" />}
                        Kirim Laporan
                    </button>
                </div>
            </form>
        </div>,
        document.body,
    );
}
