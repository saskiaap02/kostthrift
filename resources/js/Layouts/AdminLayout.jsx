import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';
import Logo from '@/Components/Layout/Logo';
import Toast from '@/Components/UI/Toast';
import { initials } from '@/Lib/format';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: 'speedometer2', exact: true },
    { href: '/admin/verifikasi-ktm', label: 'Verifikasi KTM', icon: 'patch-check', badge: 'ktm' },
    { href: '/admin/iklan', label: 'Iklan', icon: 'card-list' },
    { href: '/admin/laporan', label: 'Laporan', icon: 'flag', badge: 'reports' },
    { href: '/admin/pesanan', label: 'Pesanan', icon: 'receipt' },
    { href: '/admin/pengguna', label: 'Pengguna', icon: 'people' },
    { href: '/admin/log', label: 'Log Aksi', icon: 'clock-history' },
];

/**
 * Layout panel admin: sidebar menu (jadi baris geser di layar kecil) + area isi.
 * Terpisah dari MarketLayout: tanpa pencarian, wishlist, troli, atau tombol Jual.
 */
export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    // jumlah antrean per menu (dibagikan middleware EnsureAdmin)
    const badges = { ktm: props.adminPendingKtm ?? 0, reports: props.adminPendingReports ?? 0 };
    const path = url.split('?')[0];

    const isActive = (item) => (item.exact ? path === item.href : path.startsWith(item.href));

    return (
        <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="flex flex-col border-b border-outline-variant/30 bg-surface-container-lowest lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between px-5 py-4">
                    <Logo href="/admin" />
                    <span className="rounded-md bg-primary-container px-2 py-0.5 text-label-sm font-label-sm font-bold text-white">
                        Admin
                    </span>
                </div>

                <nav aria-label="Menu admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive(item) ? 'page' : undefined}
                            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-label-lg font-label-lg transition-colors ${
                                isActive(item)
                                    ? 'bg-primary-container font-bold text-white'
                                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                            }`}
                        >
                            <Icon name={item.icon} className="text-[16px]" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && badges[item.badge] > 0 && (
                                <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[11px] font-bold text-white">
                                    {badges[item.badge]}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3 border-t border-outline-variant/30 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-md font-label-md font-bold text-white">
                        {initials(user?.name ?? '')}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-label-lg font-label-lg font-bold text-on-surface">{user?.name}</p>
                        <div className="flex items-center gap-3 text-body-sm font-body-sm">
                            <Link href="/" className="font-bold text-primary-container hover:underline">
                                Lihat situs
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="font-bold text-error hover:underline"
                            >
                                Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="min-w-0 px-5 py-6 md:px-8">{children}</main>

            <Toast />
        </div>
    );
}
