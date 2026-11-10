const LINKS = ['Panduan Rekber', 'Titik Temu COD', 'Bantuan'];

export default function Footer() {
    return (
        <footer className="mt-10 border-t border-outline-variant/30 bg-surface-container-lowest">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3 px-margin-mobile py-8 text-center md:flex-row md:justify-between md:px-margin md:text-left">
                <div>
                    <div className="flex items-center justify-center gap-2 md:justify-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-label-md font-label-md text-on-surface-variant">
                            Server Kampus Terhubung Aktif
                        </span>
                    </div>
                    <p className="mt-1 text-body-sm font-body-sm text-outline">
                        © {new Date().getFullYear()} KosThrift. Platform Jual Beli Mahasiswa Se-Indonesia.
                    </p>
                </div>

                <nav className="flex items-center gap-4 text-label-md font-label-md font-medium text-on-surface-variant">
                    {LINKS.map((label, index) => (
                        <span key={label} className="flex items-center gap-4">
                            {index > 0 && <span aria-hidden="true">•</span>}
                            <a href="#" className="hover:text-primary">
                                {label}
                            </a>
                        </span>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
