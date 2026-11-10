import { formatRupiah } from '@/Lib/format';

export default function Price({ price, originalPrice }) {
    return (
        <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="font-headline-sm text-body-lg font-bold tabular-nums text-primary md:text-headline-sm">
                {formatRupiah(price)}
            </span>
            {originalPrice ? (
                <span className="text-[10px] tabular-nums text-outline line-through md:text-label-sm">
                    {formatRupiah(originalPrice)}
                </span>
            ) : null}
        </div>
    );
}
