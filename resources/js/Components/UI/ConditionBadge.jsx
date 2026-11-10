const STYLES = {
    baru: 'bg-emerald-500/15 text-emerald-700 border-emerald-300/40',
    second: 'bg-amber-500/15 text-amber-700 border-amber-300/40',
};

export default function ConditionBadge({ condition, label, className = '' }) {
    return (
        <span
            className={`rounded-full border px-2 py-0.5 text-label-sm font-label-sm font-bold backdrop-blur-sm ${
                STYLES[condition] ?? STYLES.second
            } ${className}`}
        >
            {label ?? condition}
        </span>
    );
}
