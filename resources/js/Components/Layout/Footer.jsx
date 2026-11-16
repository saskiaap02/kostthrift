import { Link } from '@inertiajs/react';
import { INFO_LINKS } from '@/Lib/info';

export default function Footer() {
    return (
        <footer className="mt-10 border-t border-outline-variant/30 bg-surface-container-lowest">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 px-margin-mobile py-8 text-center md:flex-row md:justify-between md:px-margin md:text-left">
                <div>
                    <div className="flex items-center justify-center gap-2 md:justify-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-label-md font-label-md text-on-surface-variant">
                            Khusus mahasiswa terverifikasi KTM
                        </span>
                    </div>
                    <p className="mt-1 text-body-sm font-body-sm text-outline">
                        © {new Date().getFullYear()} KosThrift. Jual beli perlengkapan kos antar mahasiswa.
                    </p>
                </div>

                <nav
                    aria-label="Informasi"
                    className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-label-md font-label-md font-medium text-on-surface-variant md:justify-end"
                >
                    {INFO_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
