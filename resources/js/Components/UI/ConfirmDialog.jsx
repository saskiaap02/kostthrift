import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/Components/UI/Icon';

/**
 * Dialog konfirmasi (pengganti window.confirm).
 * tone="danger" untuk aksi merusak seperti hapus, tone="primary" untuk aksi biasa.
 */
export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Ya, lanjutkan',
    cancelLabel = 'Batal',
    tone = 'primary',
    processing = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'Escape' && !processing) onCancel();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, processing, onCancel]);

    if (!open) return null;

    const danger = tone === 'danger';

    return createPortal(
        <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-on-surface/50 p-4"
            onClick={(event) => {
                if (event.target === event.currentTarget && !processing) onCancel();
            }}
        >
            <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
                <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full ${
                        danger ? 'bg-error/10 text-error' : 'bg-primary-fixed/40 text-primary-container'
                    }`}
                >
                    <Icon name={danger ? 'trash3' : 'check2-circle'} className="text-[20px]" />
                </div>
                <h2 id="confirm-title" className="font-headline-md text-headline-sm font-bold text-on-surface">
                    {title}
                </h2>
                <p className="mt-1.5 text-body-md font-body-md text-on-surface-variant">{message}</p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="h-10 rounded-xl border border-outline-variant/60 px-4 text-label-lg font-label-lg font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-60"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        autoFocus
                        className={`flex h-10 items-center gap-2 rounded-xl px-4 text-label-lg font-label-lg font-bold text-white transition-colors disabled:opacity-60 ${
                            danger ? 'bg-error hover:bg-error/90' : 'bg-primary-container hover:bg-tertiary'
                        }`}
                    >
                        {processing && <Icon name="arrow-repeat" className="animate-spin text-[13px]" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
