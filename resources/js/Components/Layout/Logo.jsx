import { Link } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

export default function Logo() {
    return (
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="KosThrift - Beranda">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-container text-primary shadow-sm">
                <Icon name="house-door-fill" className="text-[18px]" />
            </span>
            <span className="font-headline-md text-headline-md font-extrabold tracking-tight text-primary-container">
                KosThrift
            </span>
        </Link>
    );
}
