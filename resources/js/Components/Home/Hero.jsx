import Icon from '@/Components/UI/Icon';

export default function Hero({ image }) {
    return (
        <section className="mx-auto w-full max-w-[1200px] px-margin-mobile pb-4 pt-4 md:px-margin md:pt-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container via-tertiary to-primary p-space-lg text-surface-container-lowest shadow-md md:p-10">
                <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-secondary-container/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-primary-fixed/15 blur-xl" />

                <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
                    <div className="flex flex-col">
                        <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-surface-container-lowest/20 bg-surface-container-lowest/15 px-3 py-1 text-label-md font-label-md text-secondary-fixed backdrop-blur-md">
                            <Icon name="patch-check-fill" className="text-[14px]" />
                            <span>Verified Peer-to-Peer Campus</span>
                        </div>

                        <h1 className="font-display-lg text-display-lg-mobile font-extrabold leading-tight tracking-tight md:text-display-lg lg:text-[44px] lg:leading-[52px]">
                            Pasar Aman &amp; Praktis Anak Kos
                        </h1>

                        <p className="mt-3 max-w-[460px] text-body-md font-body-md leading-relaxed text-surface-container-low/90 md:text-body-lg">
                            Jual beli perlengkapan kos antar mahasiswa. Penjual dan pembeli terverifikasi KTM, bayar
                            langsung atau COD di kampus.
                        </p>

                        <div className="mt-6 flex flex-col gap-space-sm sm:flex-row">
                            <a
                                href="#katalog"
                                className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-secondary-container px-6 text-label-lg font-label-lg font-bold text-primary shadow-md transition-all hover:bg-secondary-fixed active:scale-95"
                            >
                                <Icon name="search" className="text-[18px]" />
                                <span>Cari Barang</span>
                            </a>
                            <a
                                href="/register"
                                className="flex h-12 items-center justify-center gap-1.5 rounded-xl border-2 border-surface-container-lowest bg-surface-container-lowest/10 px-6 text-label-lg font-label-lg font-bold backdrop-blur-sm transition-all hover:bg-surface-container-lowest/20 active:scale-95"
                            >
                                <Icon name="shop" className="text-[18px]" />
                                <span>Mulai Berjualan</span>
                            </a>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[460px] overflow-hidden rounded-xl border border-surface-container-lowest/20 bg-surface-container-lowest/5 shadow-lg lg:ml-auto">
                        <img
                            src={image}
                            alt="Kardus pindahan kos KosThrift"
                            className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-[11px] font-label-md font-bold text-on-secondary-container shadow-md">
                            <Icon name="tag-fill" className="text-[11px]" /> Hemat s.d 70%
                        </div>
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest/90 px-3 py-1 text-[11px] font-label-md font-bold text-primary shadow-md backdrop-blur-md">
                            <Icon name="mortarboard-fill" className="text-[12px]" /> Khusus Mahasiswa
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
