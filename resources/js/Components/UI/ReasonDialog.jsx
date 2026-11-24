import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { textareaClass } from '@/Components/UI/FormField';

/**
 * Dialog dengan kolom alasan (wajib diisi; validasi akhir di server).
 * Esc atau klik latar menutup dialog, kecuali sedang memproses. Kolom alasan otomatis terfokus.
 */
export default function ReasonDialog({
    open,
    title,
    description,
    placeholder = 'Tulis alasanmu',
    confirmLabel = 'Kirim',
    cancelLabel = 'Kembali',
    error,
    processing = false,
    onCancel,
    onSubmit,
}) {
    const [reason, setReason] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (open) {
            setReason('');
            textareaRef.current?.focus();
        }
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'Escape' && !processing) onCancel();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, processing, onCancel]);

    if (!open) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reason-dialog-title"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
            onClick={(event) => {
                if (event.target === event.currentTarget && !processing) onCancel();
            }}
        >
            <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
                <h2 id="reason-dialog-title" className="font-headline-md text-headline-sm font-bold text-on-surface">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-body-md font-body-md text-on-surface-variant">{description}</p>
                )}
                <textarea
                    ref={textareaRef}
                    autoFocus
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    maxLength={200}
                    placeholder={placeholder}
                    aria-label="Alasan"
                    className={`${textareaClass} mt-4`}
                />
                {error && (
                    <p role="alert" className="mt-1.5 text-body-sm font-body-sm font-semibold text-error">
                        {error}
                    </p>
                )}
                <div className="mt-5 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="h-11 rounded-xl border border-outline-variant/60 px-5 text-label-lg font-label-lg font-bold text-on-surface-variant hover:bg-surface-container-low disabled:opacity-60"
                    >
                        {cancelLabel}
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
        </div>,
        document.body,
    );
}
