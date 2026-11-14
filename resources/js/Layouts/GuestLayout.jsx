import { Link } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';
import Logo from '@/Components/Layout/Logo';
import { heroImage } from '@/Data/assets';

const BENEFITS = [
    { icon: 'mortarboard', text: 'Penjual terverifikasi KTM mahasiswa aktif' },
    { icon: 'shield-lock', text: 'Rekber aman: dana ditahan sampai barang diterima' },
    { icon: 'box-seam', text: 'COD di kampus, bebas ongkir' },
];

/**
 * Layout halaman tamu (login, register, lupa password, dst.):
 * kiri = form, kanan = panel biru (tersembunyi di layar kecil).
 * Halaman bawaan Breeze lain yang memakai <GuestLayout> tanpa title/subtitle tetap jalan.
 */
export default function GuestLayout({ title, subtitle, children }) {
    return (
        <div className="grid min-h-screen bg-surface font-body-md text-on-surface antialiased lg:grid-cols-2">
            <div className="flex flex-col px-margin-mobile py-6 md:px-12">
                <div className="flex items-center justify-between">
                    <Logo />
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-label-lg font-label-lg font-bold text-primary-container hover:underline"
                    >
                        <Icon name="arrow-left" className="text-[13px]" />
                        Kembali ke Beranda
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        {title && (
                            <h1 className="font-headline-lg text-headline-lg font-extrabold text-on-surface md:text-[28px] md:leading-9">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="mb-6 mt-1.5 text-body-md font-body-md text-on-surface-variant">{subtitle}</p>
                        )}
                        {children}
                    </div>
                </div>

                <p className="text-center text-body-sm font-body-sm text-outline lg:text-left">
                    © {new Date().getFullYear()} KosThrift. Platform Jual Beli Mahasiswa Se-Indonesia.
                </p>
            </div>

            <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary-container via-tertiary to-primary p-12 text-surface-container-lowest lg:flex lg:flex-col lg:justify-center">
                <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-secondary-container/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-primary-fixed/15 blur-xl" />

                <div className="relative z-10 mx-auto w-full max-w-md">
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-surface-container-lowest/20 bg-surface-container-lowest/15 px-3 py-1 text-label-md font-label-md text-secondary-fixed backdrop-blur-md">
                        <Icon name="patch-check-fill" className="text-[14px]" />
                        <span>Verified Peer-to-Peer Campus</span>
                    </div>

                    <h2 className="font-display-lg text-[34px] font-extrabold leading-tight tracking-tight">
                        Pasar Aman &amp; Praktis Anak Kos
                    </h2>
                    <p className="mt-3 text-body-lg font-body-lg leading-relaxed text-surface-container-low/90">
                        Jual beli perlengkapan kos antar mahasiswa, dengan verifikasi KTM dan garansi rekber kampus.
                    </p>

                    <div className="relative mt-7 overflow-hidden rounded-2xl border border-surface-container-lowest/20 bg-surface-container-lowest/5 shadow-lg">
                        <img src={heroImage} alt="Kardus pindahan kos KosThrift" className="h-auto w-full object-cover" />
                    </div>

                    <ul className="mt-6 space-y-3">
                        {BENEFITS.map((item) => (
                            <li key={item.icon} className="flex items-center gap-3 text-body-md font-body-md">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest/15 text-secondary-fixed">
                                    <Icon name={item.icon} className="text-[15px]" />
                                </span>
                                {item.text}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}
