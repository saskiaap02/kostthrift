import { Link } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

/** Navigasi halaman untuk daftar berpaginasi (prop `links` dan `meta` dari Resource). */
export default function Pagination({ links, meta }) {
    if (meta.last_page <= 1) return null;

    const base =
        'flex h-10 items-center gap-1.5 rounded-xl border px-4 text-label-lg font-label-lg font-bold transition-colors';
    const active = `${base} border-outline-variant/60 bg-surface-container-lowest text-primary-container hover:bg-surface-container-low`;
    const disabled = `${base} cursor-not-allowed border-transparent bg-surface-container text-outline`;

    return (
        <nav aria-label="Halaman" className="mt-6 flex items-center justify-center gap-3">
            {links.prev ? (
                <Link href={links.prev} preserveScroll className={active}>
                    <Icon name="chevron-left" className="text-[12px]" />
                    Sebelumnya
                </Link>
            ) : (
                <span className={disabled}>
                    <Icon name="chevron-left" className="text-[12px]" />
                    Sebelumnya
                </span>
            )}

            <span className="text-body-md font-body-md text-on-surface-variant">
                Halaman {meta.current_page} dari {meta.last_page}
            </span>

            {links.next ? (
                <Link href={links.next} preserveScroll className={active}>
                    Berikutnya
                    <Icon name="chevron-right" className="text-[12px]" />
                </Link>
            ) : (
                <span className={disabled}>
                    Berikutnya
                    <Icon name="chevron-right" className="text-[12px]" />
                </span>
            )}
        </nav>
    );
}
