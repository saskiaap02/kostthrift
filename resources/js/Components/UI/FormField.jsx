const fieldBase =
    'w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-3.5 text-body-md font-body-md text-on-surface shadow-sm placeholder:text-outline transition-colors focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20 disabled:bg-surface-container-low disabled:text-outline';

/** Kelas untuk input/select satu baris dan textarea. */
export const inputClass = `h-11 ${fieldBase}`;
export const textareaClass = `min-h-[140px] py-3 ${fieldBase}`;

/** Label + kontrol + petunjuk + pesan error. */
export default function FormField({ label, htmlFor, error, hint, required = false, children, className = '' }) {
    return (
        <div className={className}>
            <label htmlFor={htmlFor} className="mb-1.5 block text-label-lg font-label-lg font-bold text-on-surface">
                {label}
                {required && <span className="ml-0.5 text-error">*</span>}
            </label>
            {children}
            {hint && !error && <p className="mt-1.5 text-body-sm font-body-sm text-on-surface-variant">{hint}</p>}
            {error && (
                <p role="alert" className="mt-1.5 text-body-sm font-body-sm font-semibold text-error">
                    {error}
                </p>
            )}
        </div>
    );
}
