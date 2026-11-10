import Icon from '@/Components/UI/Icon';

const ITEMS = [
    {
        icon: 'mortarboard',
        iconClass: 'bg-blue-100 text-blue-700',
        title: 'Mahasiswa Terverifikasi KTM',
        text: 'Penjual diverifikasi kartu mahasiswa aktif kampus, transaksi terpercaya tanpa tipu-tipu akun bodong.',
    },
    {
        icon: 'shield-lock',
        iconClass: 'bg-emerald-100 text-emerald-700',
        title: 'In-App Rekber Aman',
        text: 'Dana pembeli disimpan aman di rekening bersama KosThrift hingga barang diterima dan dicek langsung.',
    },
    {
        icon: 'handshake',
        iconClass: 'bg-amber-100 text-amber-800',
        title: 'COD Kampus Bebas Ongkir',
        text: 'Ketemu langsung di gerbang kampus, halte bikun, atau kantin favorit tanpa biaya kirim & anti ribet.',
    },
];

export default function TrustSection() {
    return (
        <section className="mx-auto w-full max-w-[1200px] px-margin-mobile pb-2 pt-10 md:px-margin">
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-8">
                <div className="mb-5 text-center">
                    <span className="rounded-full bg-primary-fixed/30 px-3 py-1 text-label-sm font-label-sm font-bold uppercase tracking-wider text-primary">
                        Jaminan Transaksi Mahasiswa
                    </span>
                    <h2 className="mt-2 font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                        Kenapa Harus KosThrift?
                    </h2>
                </div>

                <div className="grid gap-3 md:grid-cols-3 md:gap-4">
                    {ITEMS.map((item) => (
                        <div
                            key={item.title}
                            className="flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/60 p-3 md:flex-col md:p-4"
                        >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}>
                                <Icon name={item.icon} className="text-[22px]" />
                            </div>
                            <div>
                                <h3 className="font-headline-sm text-body-md font-bold text-on-surface">{item.title}</h3>
                                <p className="mt-0.5 text-body-sm font-body-sm leading-snug text-on-surface-variant md:text-body-md">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-variant/40 p-3 text-label-md font-label-md text-on-surface-variant">
                    <Icon name="lightbulb" className="text-[16px] text-primary" />
                    <span>
                        <strong>Tips Pindahan:</strong> Selalu cek kelengkapan barang elektronik saat COD di ruang
                        publik kampus.
                    </span>
                </div>
            </div>
        </section>
    );
}
