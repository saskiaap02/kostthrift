import { Head, router } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import Pagination from '@/Components/UI/Pagination';

export default function Index({ notifications }) {
    const items = notifications.data ?? [];
    const hasUnread = items.some((item) => !item.is_read);

    const handleOpen = (item) => {
        router.post(`/notifikasi/${item.id}/baca`);
    };

    const handleReadAll = () => {
        router.post('/notifikasi/baca-semua', {}, { preserveScroll: true });
    };

    return (
        <MarketLayout>
            <Head title="Notifikasi" />

            <div className="mx-auto w-full max-w-[800px] px-margin-mobile pb-8 pt-6 md:px-margin">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface">Notifikasi</h1>
                        <p className="text-body-md font-body-md text-on-surface-variant">
                            Pembaruan status pesanan, pembayaran, dan verifikasi KTM akunmu.
                        </p>
                    </div>

                    {hasUnread && (
                        <button
                            type="button"
                            onClick={handleReadAll}
                            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-primary-container/40 bg-primary-fixed/30 px-4 text-label-lg font-label-lg font-bold text-primary-container transition-colors hover:bg-primary-fixed/60"
                        >
                            <Icon name="check2-all" className="text-[15px]" />
                            <span>Tandai semua dibaca</span>
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                            <Icon name="bell-slash" className="text-[26px]" />
                        </div>
                        <h2 className="mt-4 font-headline-sm text-body-lg font-bold text-on-surface">Belum ada notifikasi</h2>
                        <p className="mt-1 max-w-md text-body-md font-body-md text-on-surface-variant">
                            Semua pembaruan pesanan masuk, pembayaran, dan hasil pemeriksaan KTM akan muncul di sini.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
                        <ul className="divide-y divide-outline-variant/30">
                            {items.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleOpen(item)}
                                        className={`flex w-full items-start gap-3.5 px-4 py-4 text-left transition-colors hover:bg-surface-container-low md:px-5 ${
                                            !item.is_read ? 'bg-primary-fixed/25' : ''
                                        }`}
                                    >
                                        <div
                                            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                !item.is_read
                                                    ? 'bg-primary-container text-white'
                                                    : 'bg-surface-container text-on-surface-variant'
                                            }`}
                                        >
                                            <Icon name={item.icon} className="text-[16px]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-body-md font-body-md font-bold text-on-surface">
                                                    {item.title}
                                                </p>
                                                {!item.is_read && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                                                        Baru
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                                                {item.message}
                                            </p>
                                            <p className="mt-1.5 text-body-sm font-body-sm text-outline">
                                                {item.created_at}
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {notifications.meta && <Pagination meta={notifications.meta} className="mt-6" />}
            </div>
        </MarketLayout>
    );
}