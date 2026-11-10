import Icon from '@/Components/UI/Icon';

export default function VerifiedBadge({ className = '' }) {
    return (
        <div
            className={`inline-flex items-center gap-1 rounded border border-blue-200/60 bg-blue-50 px-1.5 py-0.5 text-[9px] font-label-sm font-bold text-blue-700 md:text-[10px] ${className}`}
        >
            <Icon name="patch-check-fill" className="text-[11px]" />
            <span>Terverifikasi KTM</span>
        </div>
    );
}
