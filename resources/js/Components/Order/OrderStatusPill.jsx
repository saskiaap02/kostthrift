// Gaya ada di file .jsx karena Tailwind hanya memindai .jsx.
const STYLES = {
    pending: 'bg-amber-100 text-amber-800',
    accepted: 'bg-blue-100 text-blue-800',
    awaiting_payment: 'bg-amber-100 text-amber-800',
    payment_reported: 'bg-blue-100 text-blue-800',
    paid: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-surface-container text-on-surface-variant',
};

export default function OrderStatusPill({ status, label }) {
    return (
        <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-label-sm font-label-sm font-bold ${
                STYLES[status] ?? STYLES.pending
            }`}
        >
            {label}
        </span>
    );
}
