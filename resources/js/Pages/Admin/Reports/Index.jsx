import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import Pagination from '@/Components/UI/Pagination';
import { cleanFilters } from '@/Lib/query';
import { formatRupiah } from '@/Lib/format';

const TABS = [
    { value: 'pending', label: 'Menunggu' },
    { value: 'resolved', label: 'Diturunkan' },
    { value: 'dismissed', label: 'Ditolak' },
    { value: 'all', label: 'Semua' },
];

const STATUS_STYLE = {
    pending: 'bg-amber-100 text-amber-800',
    resolved: 'bg-emerald-100 text-emerald-700',
    dismissed: 'bg-surface-container text-on-surface-variant',
};

/**
 * Props dari Admin\ReportReviewController@index:
 *   reports  { data: [AdminReportResource], meta, links }
 *   filters  { status }  pending | resolved | dismissed | all
 */
export default function Index({ reports, filters }) {
    const { errors } = usePage().props;
    const [target, setTarget] = useState(null); // { report, action: 'take-down' | 'dismiss' }
    const [busy, setBusy] = useState(false);

    const visit = (status) =>
        router.get('/admin/laporan', cleanFilters({ status: status === 'pending' ? '' : status }), {
            preserveState: true,
            preserveScroll: true,
        });

    const act = () => {
        const path = target.action === 'take-down' ? 'turunkan' : 'tolak';

        setBusy(true);
        router.post(`/admin/laporan/${target.report.id}/${path}`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setBusy(false);
                setTarget(null);
            },
        });
    };

    const takeDown = target?.action === 'take-down';

    return (
        <AdminLayout>
            <Head title="Laporan (Admin)" />

            <div className="w-full max-w-[1000px]">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Laporan Iklan
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Tinjau laporan dari pengguna, lalu turunkan iklan yang terbukti melanggar aturan.
                </p>

                <div role="tablist" aria-label="Status laporan" className="mt-5 flex gap-2 overflow-x-auto pb-1">
                    {TABS.map((tab) => {
                        const active = filters.status === tab.value;
                        return (
                            <button
                                key={tab.value}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => visit(tab.value)}
                                className={`h-10 shrink-0 rounded-full px-5 text-label-lg font-label-lg transition-colors ${
                                    active
                                        ? 'bg-primary-container font-bold text-white'
                                        : 'border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary-container'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {errors.report && (
                    <p role="alert" className="mt-4 rounded-xl bg-error/10 px-4 py-3 text-body-md font-body-md font-semibold text-error">
                        {errors.report}
                    </p>
                )}

                {reports.data.length === 0 ? (
                    <p className="mt-6 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-12 text-center text-body-md font-body-md text-on-surface-variant">
                        {filters.status === 'pending' ? 'Tidak ada laporan yang menunggu. Kerja bagus!' : 'Tidak ada laporan.'}
                    </p>
                ) : (
                    <ul className="mt-5 space-y-3">
                        {reports.data.map((report) => {
                            const { product } = report;
                            return (
                                <li
                                    key={report.id}
                                    className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4"
                                >
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                                                {product.image_url && (
                                                    <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-body-md font-body-md font-semibold text-on-surface">
                                                    {product.title}
                                                </p>
                                                <p className="text-body-sm font-body-sm tabular-nums text-on-surface-variant">
                                                    {formatRupiah(product.price)}
                                                </p>
                                                <p className="flex flex-wrap items-center gap-x-2 text-body-sm font-body-sm text-on-surface-variant">
                                                    Penjual:
                                                    <Link
                                                        href={`/admin/pengguna?q=${encodeURIComponent(product.seller.email)}`}
                                                        className="font-semibold text-primary-container hover:underline"
                                                    >
                                                        {product.seller.name}
                                                    </Link>
                                                    {product.seller.suspended && (
                                                        <span className="rounded-full bg-error/10 px-2 py-0.5 text-label-sm font-label-sm font-bold text-error">
                                                            Akun diblokir
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-label-sm font-label-sm font-bold ${STATUS_STYLE[report.status]}`}
                                            >
                                                {report.status_label}
                                            </span>
                                            {product.taken_down && (
                                                <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-sm font-label-sm font-bold text-on-surface-variant">
                                                    Iklan sudah turun
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3 rounded-xl bg-surface-container-low/70 px-3.5 py-3">
                                        <p className="flex items-center gap-2 text-body-md font-body-md font-semibold text-on-surface">
                                            <Icon name="flag-fill" className="text-[13px] text-error" />
                                            {report.reason_label}
                                        </p>
                                        {report.detail && (
                                            <p className="mt-1 whitespace-pre-line text-body-md font-body-md text-on-surface-variant">
                                                {report.detail}
                                            </p>
                                        )}
                                        <p className="mt-1.5 text-body-sm font-body-sm text-outline">
                                            Dilaporkan {report.reporter.name} · {report.reported_at}
                                            {report.status === 'pending' && report.pending_for_product > 1 && (
                                                <strong className="ml-1 font-bold text-orange-600">
                                                    · {report.pending_for_product} laporan menunggu untuk iklan ini
                                                </strong>
                                            )}
                                        </p>
                                        {report.handled_at && (
                                            <p className="text-body-sm font-body-sm text-outline">
                                                Ditangani {report.handled_by ?? 'admin'} · {report.handled_at}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                                        {!product.taken_down && (
                                            <Link
                                                href={`/produk/${product.slug}`}
                                                className="flex h-9 items-center rounded-lg border border-outline-variant/60 px-3 text-label-md font-label-md font-bold text-primary-container hover:bg-surface-container-low"
                                            >
                                                Lihat iklan
                                            </Link>
                                        )}
                                        {report.status === 'pending' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setTarget({ report, action: 'dismiss' })}
                                                    className="flex h-9 items-center rounded-lg border border-outline-variant/60 px-3 text-label-md font-label-md font-bold text-on-surface-variant hover:bg-surface-container-low"
                                                >
                                                    Tolak laporan
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTarget({ report, action: 'take-down' })}
                                                    className="flex h-9 items-center gap-1 rounded-lg bg-error px-3 text-label-md font-label-md font-bold text-white hover:bg-error/90"
                                                >
                                                    <Icon name="trash3" className="text-[13px]" />
                                                    {product.taken_down ? 'Tandai terbukti' : 'Turunkan iklan'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <Pagination links={reports.links} meta={reports.meta} />
            </div>

            <ConfirmDialog
                open={Boolean(target)}
                title={takeDown ? 'Turunkan iklan ini?' : 'Tolak laporan ini?'}
                message={
                    takeDown
                        ? `"${target?.report.product.title}" akan disembunyikan dari katalog, semua laporan yang menunggu untuk iklan ini ditutup, dan pesanan yang belum dibayar ikut dibatalkan.`
                        : 'Laporan ditutup tanpa tindakan. Iklan tetap tayang.'
                }
                confirmLabel={takeDown ? 'Ya, turunkan' : 'Ya, tolak'}
                tone={takeDown ? 'danger' : 'primary'}
                processing={busy}
                onConfirm={act}
                onCancel={() => setTarget(null)}
            />
        </AdminLayout>
    );
}
