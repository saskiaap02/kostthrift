import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import VerifiedBadge from '@/Components/UI/VerifiedBadge';
import { formatRupiah, initials } from '@/Lib/format';

export default function Index({ conversations, active_conversation_id, messages }) {
    const { errors } = usePage().props;
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    const activeConversation = conversations.find((item) => item.id === active_conversation_id) ?? null;

    // Auto-scroll ke pesan terbaru
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [active_conversation_id, messages.length]);

    // Polling ringan tiap 5 detik saat ruang chat terbuka agar pesan baru masuk otomatis
    useEffect(() => {
        if (!active_conversation_id) return undefined;
        const timer = setInterval(() => {
            router.reload({ only: ['conversations', 'messages'], preserveScroll: true });
        }, 5000);
        return () => clearInterval(timer);
    }, [active_conversation_id]);

    const handleSend = (event) => {
        event.preventDefault();
        if (!activeConversation || !body.trim() || sending) return;

        setSending(true);
        router.post(
            `/pesan/${activeConversation.id}/kirim`,
            { body: body.trim() },
            {
                preserveScroll: true,
                onSuccess: () => setBody(''),
                onFinish: () => setSending(false),
            },
        );
    };

    return (
        <MarketLayout>
            <Head title="Pesan" />

            <div className="mx-auto w-full max-w-[1200px] px-margin-mobile pb-6 pt-5 md:px-margin">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface">Pesan</h1>
                        <p className="text-body-md font-body-md text-on-surface-variant">
                            Tanya kondisi barang dan sepakati titik temu COD di kampus secara langsung.
                        </p>
                    </div>
                </div>

                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed/40 text-primary">
                            <Icon name="chat-dots" className="text-[26px]" />
                        </div>
                        <h2 className="mt-4 font-headline-sm text-body-lg font-bold text-on-surface">Belum ada percakapan</h2>
                        <p className="mt-1 max-w-md text-body-md font-body-md text-on-surface-variant">
                            Klik tombol Tanya Penjual pada halaman detail barang untuk mulai berdiskusi dengan penjual.
                        </p>
                        <Link
                            href="/"
                            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary-container px-5 text-label-lg font-label-lg font-bold text-white hover:bg-tertiary"
                        >
                            <Icon name="search" className="text-[14px]" />
                            Jelajahi Katalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid min-h-[540px] overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm md:grid-cols-[320px_minmax(0,1fr)]">
                        {/* Daftar Percakapan */}
                        <aside className="border-b border-outline-variant/30 md:border-b-0 md:border-r">
                            <div className="border-b border-outline-variant/30 px-4 py-3">
                                <p className="text-label-lg font-label-lg font-bold text-on-surface">
                                    Daftar Obrolan ({conversations.length})
                                </p>
                            </div>
                            <ul className="max-h-[260px] divide-y divide-outline-variant/20 overflow-y-auto md:max-h-[520px]">
                                {conversations.map((item) => {
                                    const isActive = item.id === activeConversation?.id;
                                    return (
                                        <li key={item.id}>
                                            <Link
                                                href={`/pesan/${item.id}`}
                                                className={`flex items-start gap-3 px-4 py-3.5 transition-colors ${
                                                    isActive ? 'bg-primary-fixed/35' : 'hover:bg-surface-container-low'
                                                }`}
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-md font-label-md font-bold text-white">
                                                    {initials(item.counterpart.name)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="truncate text-body-md font-body-md font-bold text-on-surface">
                                                            {item.counterpart.name}
                                                        </p>
                                                        {item.unread_count > 0 && (
                                                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                                                                {item.unread_count}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.product && (
                                                        <p className="truncate text-body-sm font-body-sm font-semibold text-primary">
                                                            {item.product.title}
                                                        </p>
                                                    )}
                                                    <p className="mt-0.5 truncate text-body-sm font-body-sm text-on-surface-variant">
                                                        {item.last_message
                                                            ? `${item.last_message.is_mine ? 'Kamu: ' : ''}${item.last_message.body}`
                                                            : 'Mulai kirim pesan pertama...'}
                                                    </p>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </aside>

                        {/* Ruang Obrolan Aktif */}
                        {activeConversation ? (
                            <section className="flex flex-col">
                                {/* Header Lawan Bicara */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30 bg-surface-container-lowest px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-md font-label-md font-bold text-white">
                                            {initials(activeConversation.counterpart.name)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="font-headline-sm text-body-lg font-bold text-on-surface">
                                                    {activeConversation.counterpart.name}
                                                </h2>
                                                {activeConversation.counterpart.ktm_verified && <VerifiedBadge />}
                                            </div>
                                            <p className="text-body-sm font-body-sm text-on-surface-variant">
                                                {activeConversation.counterpart.campus ?? 'Mahasiswa Terdaftar'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Kartu Konteks Produk (jika ada) */}
                                {activeConversation.product && (
                                    <Link
                                        href={`/produk/${activeConversation.product.slug}`}
                                        className="flex items-center gap-3 border-b border-outline-variant/30 bg-surface-container-low/70 px-4 py-2.5 transition-colors hover:bg-surface-container"
                                    >
                                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                                            {activeConversation.product.image_url && (
                                                <img
                                                    src={activeConversation.product.image_url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-body-sm font-body-sm font-bold text-on-surface">
                                                {activeConversation.product.title}
                                            </p>
                                            <p className="text-body-sm font-body-sm font-extrabold tabular-nums text-primary">
                                                {formatRupiah(activeConversation.product.price)}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-label-md font-label-md font-bold text-primary-container">
                                            Lihat barang
                                            <Icon name="chevron-right" className="text-[11px]" />
                                        </span>
                                    </Link>
                                )}

                                {/* Daftar Balon Pesan */}
                                <div className="flex-1 space-y-3 overflow-y-auto bg-surface-container-low/30 p-4" style={{ maxHeight: '380px' }}>
                                    {messages.length === 0 ? (
                                        <p className="py-10 text-center text-body-md font-body-md text-on-surface-variant">
                                            Belum ada pesan. Tanyakan ketersediaan barang atau lokasi COD di kampus.
                                        </p>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${msg.is_mine ? 'items-end' : 'items-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-body-md font-body-md leading-relaxed ${
                                                        msg.is_mine
                                                            ? 'rounded-br-sm bg-primary-container text-white'
                                                            : 'rounded-bl-sm border border-outline-variant/40 bg-surface-container-lowest text-on-surface'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-line break-words">{msg.body}</p>
                                                </div>
                                                <span className="mt-1 flex items-center gap-1 text-[11px] text-outline">
                                                    {msg.sent_at}
                                                    {msg.is_mine && (
                                                        <Icon
                                                            name={msg.is_read ? 'check2-all' : 'check2'}
                                                            className={`text-[13px] ${msg.is_read ? 'text-primary' : 'text-outline'}`}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Form Kirim Pesan */}
                                <form
                                    onSubmit={handleSend}
                                    className="border-t border-outline-variant/30 bg-surface-container-lowest p-3"
                                >
                                    {errors.body && (
                                        <p className="mb-1.5 text-body-sm font-body-sm font-semibold text-error">{errors.body}</p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            maxLength={1000}
                                            placeholder="Tulis pesan untuk penjual/pembeli..."
                                            className="h-11 flex-1 rounded-xl border border-outline-variant/60 bg-surface-container-low/50 px-3.5 text-body-md font-body-md text-on-surface placeholder:text-outline focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !body.trim()}
                                            className="flex h-11 items-center gap-1.5 rounded-xl bg-primary-container px-4 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary disabled:opacity-50"
                                        >
                                            <Icon name="send-fill" className="text-[14px]" />
                                            <span>Kirim</span>
                                        </button>
                                    </div>
                                </form>
                            </section>
                        ) : null}
                    </div>
                )}
            </div>
        </MarketLayout>
    );
}