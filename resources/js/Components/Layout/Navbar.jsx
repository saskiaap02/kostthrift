import { useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';
import Logo from '@/Components/Layout/Logo';
import SearchBar from '@/Components/Layout/SearchBar';
import useClickOutside from '@/Hooks/useClickOutside';
import { initials } from '@/Lib/format';

function IconButton({ icon, label, count = 0, dot = false, href = null }) {
    const className =
        'relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container active:scale-90';

    const content = (
        <>
            <Icon name={icon} className="text-[20px]" />
            {count > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                    {count}
                </span>
            )}
            {dot && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-surface-container-lowest bg-orange-500" />
            )}
        </>
    );

    // Tamu: arahkan ke halaman login. User login: halaman tujuan dibuat di langkah berikutnya.
    return href ? (
        <Link href={href} aria-label={label} className={className}>
            {content}
        </Link>
    ) : (
        <button type="button" aria-label={label} className={className}>
            {content}
        </button>
    );
}

function UserMenu({ user }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useClickOutside(ref, () => setOpen(false));
    const incoming = usePage().props.counts?.orders_incoming ?? 0;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label="Menu profil"
                aria-expanded={open}
                className="relative rounded-full p-0.5 ring-2 ring-primary-container/20 transition-transform active:scale-95"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-label-md font-label-md font-bold text-white">
                    {initials(user.name)}
                </div>
                {user.ktm_verified_at && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-surface-container-lowest bg-emerald-500" />
                )}
                {incoming > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-surface-container-lowest bg-orange-500" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-lowest py-1 shadow-[0_8px_24px_-4px_rgba(27,58,140,0.12)]">
                    <div className="border-b border-outline-variant/30 px-3 py-2">
                        <p className="truncate text-label-lg font-label-lg font-bold text-on-surface">{user.name}</p>
                        <p className="truncate text-body-sm font-body-sm text-outline">{user.email}</p>
                    </div>
                    {user.role === 'admin' ? (
                        <Link
                            href="/admin/verifikasi-ktm"
                            className="flex items-center gap-2 px-3 py-2 text-label-lg font-label-lg text-on-surface hover:bg-surface-container-low"
                        >
                            <Icon name="shield-check" className="text-[16px]" />
                            Panel Admin
                        </Link>
                    ) : (
                        <Link
                            href="/verifikasi-ktm"
                            className="flex items-center justify-between gap-2 px-3 py-2 text-label-lg font-label-lg text-on-surface hover:bg-surface-container-low"
                        >
                            <span className="flex items-center gap-2">
                                <Icon name="patch-check" className="text-[16px]" />
                                Verifikasi KTM
                            </span>
                            {user.ktm_verified_at && (
                                <Icon name="check-circle-fill" className="text-[14px] text-emerald-600" />
                            )}
                        </Link>
                    )}
                    {user.role !== 'admin' && (
                        <>
                            <Link
                                href="/iklan-saya"
                                className="flex items-center gap-2 px-3 py-2 text-label-lg font-label-lg text-on-surface hover:bg-surface-container-low"
                            >
                                <Icon name="box-seam" className="text-[16px]" />
                                Iklan Saya
                            </Link>
                            <Link
                                href="/pesanan"
                                className="flex items-center justify-between gap-2 px-3 py-2 text-label-lg font-label-lg text-on-surface hover:bg-surface-container-low"
                            >
                                <span className="flex items-center gap-2">
                                    <Icon name="receipt" className="text-[16px]" />
                                    Pesanan
                                </span>
                                {incoming > 0 && (
                                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                                        {incoming}
                                    </span>
                                )}
                            </Link>
                            <Link
                                href="/pengaturan/pembayaran"
                                className="flex items-center gap-2 px-3 py-2 text-label-lg font-label-lg text-on-surface hover:bg-surface-container-low"
                            >
                                <Icon name="credit-card" className="text-[16px]" />
                                Rekening Pembayaran
                            </Link>
                        </>
                    )}
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-label-lg font-label-lg text-on-surface hover:bg-surface-container-low"
                    >
                        <Icon name="person" className="text-[16px]" />
                        Profil
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-label-lg font-label-lg text-error hover:bg-surface-container-low"
                    >
                        <Icon name="box-arrow-right" className="text-[16px]" />
                        Keluar
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const { props } = usePage();
    const user = props.auth?.user;
    const isAdmin = user?.role === 'admin';
    // Langkah 4: counts dibagikan dari HandleInertiaRequests::share()
    const counts = props.counts ?? {};

    return (
        <header className="sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-surface-container-lowest/95 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-2.5 px-margin-mobile py-3 md:flex-nowrap md:px-margin">
                <Logo />

                {!isAdmin && (
                    <SearchBar className="order-last w-full basis-full md:order-none md:mx-auto md:max-w-xl md:flex-1 md:basis-auto" />
                )}

                <div className={`flex items-center gap-1 ${isAdmin ? 'ml-auto' : 'ml-auto md:ml-0'}`}>
                    {isAdmin ? (
                        <Link
                            href="/admin"
                            className="mx-1 flex h-10 items-center gap-1.5 rounded-full bg-primary-container px-4 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary"
                        >
                            <Icon name="speedometer2" className="text-[14px]" />
                            <span>Panel Admin</span>
                        </Link>
                    ) : (
                        <>
                    <IconButton
                        icon="heart"
                        label="Wishlist"
                        count={counts.wishlist}
                        href={user ? '/wishlist' : '/login'}
                    />
                    <IconButton icon="bag" label="Troli" count={counts.cart} href={user ? '/troli' : '/login'} />
                    <IconButton
                        icon="chat-dots"
                        label="Pesan"
                        count={counts.unread_chats}
                        href={user ? '/pesan' : '/login'}
                    />

                    <Link
                        href="/jual"
                        className="mx-1 flex h-10 items-center gap-1.5 rounded-full bg-secondary-container px-4 text-label-lg font-label-lg font-bold text-primary shadow-sm transition-all hover:bg-secondary-fixed active:scale-95"
                    >
                        <Icon name="plus-lg" className="text-[14px]" />
                        <span>Jual</span>
                    </Link>

                        </>
                    )}

                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <div className="flex items-center gap-1">
                            <Link
                                href="/login"
                                className="rounded-full px-3 py-2 text-label-lg font-label-lg font-bold text-primary-container hover:bg-surface-container-low"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="hidden rounded-full bg-primary-container px-4 py-2 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary sm:block"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
