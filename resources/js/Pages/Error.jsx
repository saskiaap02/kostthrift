import { Head, Link } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';

export default function Error({ status }) {
    const content = {
        503: {
            title: 'Layanan Sedang Pemeliharaan',
            description: 'KosThrift sedang dalam pemeliharaan singkat. Silakan coba beberapa saat lagi.',
        },
        500: {
            title: 'Terjadi Kesalahan Server',
            description: 'Maaf, terjadi gangguan teknis di server kami. Tim kami sedang menanganinya.',
        },
        404: {
            title: 'Halaman Tidak Ditemukan',
            description: 'Halaman atau barang yang kamu cari mungkin sudah dihapus, terjual, atau link-nya salah.',
        },
        403: {
            title: 'Akses Ditolak',
            description: 'Maaf, kamu tidak memiliki izin untuk membuka halaman ini.',
        },
    }[status] || {
        title: 'Terjadi Kesalahan',
        description: 'Maaf, permintaanmu tidak dapat diproses saat ini.',
    };

    return (
        <MarketLayout>
            <Head title={`${status} - ${content.title}`} />

            <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-margin-mobile py-12 text-center md:px-margin">
                <span className="inline-flex items-center rounded-full bg-surface-container px-3.5 py-1 text-label-md font-label-md font-bold text-primary">
                    Error {status}
                </span>

                <h1 className="mt-4 font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    {content.title}
                </h1>

                <p className="mt-2.5 text-body-md font-body-md leading-relaxed text-on-surface-variant">
                    {content.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-label-lg font-label-lg font-bold text-on-primary shadow-sm transition hover:opacity-95"
                    >
                        <Icon name="arrow-left" className="text-[13px]" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </MarketLayout>
    );
}