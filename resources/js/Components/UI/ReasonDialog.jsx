import { useEffect, useState } from 'react';
import { textareaClass } from '@/Components/UI/FormField';

/** Dialog dengan kolom alasan (wajib diisi). */
export default function ReasonDialog({
    open,
    title,
    description,
    placeholder = 'Tulis alasanmu',
    confirmLabel = 'Kirim',
    error,
    processing = false,
    onCancel,
    onSubmit,
}) {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (open) setReason('');
    }, [open]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
            onClick={(event) => event.target === event.currentTarget && onCancel()}
        >
            <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
                <h2 className="font-headline-md text-headline-sm font-bold text-on-surface">{title}</h2>
                {description && (
                    <p className="mt-1 text-body-md font-body-md text-on-surface-variant">{description}</p>
                )}
                <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    maxLength={200}
                    placeholder={placeholder}
                    className={`${textareaClass} mt-4`}
                />
                {error && <p className="mt-1.5 text-body-sm font-body-sm font-semibold text-error">{error}</p>}
                <div className="mt-5 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-11 rounded-xl border border-outline-variant/60 px-5 text-label-lg font-label-lg font-bold text-on-surface-variant hover:bg-surface-container-low"
                    >
                        Kembali
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => onSubmit(reason)}
                        className="h-11 rounded-xl bg-error px-5 text-label-lg font-label-lg font-bold text-white hover:opacity-90 disabled:opacity-60"
                    >
                        {processing ? 'Memproses...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
