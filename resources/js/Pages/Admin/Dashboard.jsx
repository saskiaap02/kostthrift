import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import { formatRupiah } from '@/Lib/format';

function StatCard({ icon, label, value, hint, href, alert = false }) {
    const body = (
        <div
            className={`h-full rounded-2xl border p-4 shadow-sm transition-shadow ${
                alert ? 'border-orange-300 bg-orange-50' : 'border-outline-variant/40 bg-surface-container-lowest'
            } ${href ? 'hover:shadow-md' : ''}`}
        >
            <div className="flex items-center justify-between">
                <span className="text-label-lg font-label-lg text-on-surface-variant">{label}</span>
                <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        alert ? 'bg-orange-500 text-white' : 'bg-primary-fixed/40 text-primary'
                    }`}
                >
                    <Icon name={icon} className="text-[15px]" />
                </span>
            </div>
            <p className="mt-2 font-headline-lg text-[28px] font-extrabold leading-none tabular-nums text-on-surface">
                {value}
            </p>
            {hint && <p className="mt-1.5 text-body-sm font-body-sm text-on-surface-variant">{hint}</p>}
        </div>
    );

    return href ? (
        <Link href={href} className="block">
            {body}
        </Link>
    ) : (
        body
    );
}

/**
 * Props dari Admin\DashboardController@index:
 *   stats            { users, verified_users, new_users, pending_ktm, active_products, sold_products, new_products }
 *   pending          [KtmVerificationResource] 5 antrean tertua
 *   recent_products  [AdminProductResource] 5 iklan terbaru
 */
export default function Dashboard({ stats, pending, recent_products }) {
    const verifiedPercent = stats.users > 0 ? Math.round((stats.verified_users / stats.users) * 100) : 0;

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="w-full max-w-[1000px]">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Dashboard
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Ringkasan aktivitas KosThrift.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <StatCard
                        icon="patch-check"
                        label="Menunggu verifikasi"
                        value={stats.pending_ktm}
                        hint={stats.pending_ktm > 0 ? 'Perlu diperiksa' : 'Tidak ada antrean'}
                        href="/admin/verifikasi-ktm"
                        alert={stats.pending_ktm > 0}
                    />
                    <StatCard
                        icon="people"
                        label="Pengguna"
                        value={stats.users}
                        hint={`${stats.new_users} baru dalam 7 hari`}
                        href="/admin/pengguna"
                    />
                    <StatCard
                        icon="mortarboard"
                        label="Terverifikasi KTM"
                        value={stats.verified_users}
                        hint={`${verifiedPercent}% dari pengguna`}
                    />
                    <StatCard
                        icon="card-list"
                        label="Iklan aktif"
                        value={stats.active_products}
                        hint={`${stats.new_products} baru dalam 7 hari`}
                        href="/admin/iklan"
                    />
                    <StatCard icon="check2-circle" label="Iklan terjual" value={stats.sold_products} />
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-headline-md text-headline-sm font-bold text-on-surface">
                                Menunggu verifikasi
                            </h2>
                            <Link
                                href="/admin/verifikasi-ktm"
                                className="text-body-md font-body-md font-bold text-primary-container hover:underline"
                            >
                                Lihat semua
                            </Link>
                        </div>

                        {pending.length === 0 ? (
                            <p className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-8 text-center text-body-md font-body-md text-on-surface-variant">
                                Tidak ada pengajuan yang menunggu.
                            </p>
                        ) : (
                            <ul className="divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                                {pending.map((item) => (
                                    <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-body-md font-body-md font-semibold text-on-surface">
                                                {item.user.name}
                                            </p>
                                            <p className="truncate text-body-sm font-body-sm text-on-surface-variant">
                                                {item.university} - {item.submitted_at}
                                            </p>
                                        </div>
                                        <Link
                                            href="/admin/verifikasi-ktm"
                                            className="shrink-0 rounded-lg border border-outline-variant/60 px-3 py-1.5 text-label-md font-label-md font-bold text-primary-container hover:bg-surface-container-low"
                                        >
                                            Periksa
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-headline-md text-headline-sm font-bold text-on-surface">Iklan terbaru</h2>
                            <Link
                                href="/admin/iklan"
                                className="text-body-md font-body-md font-bold text-primary-container hover:underline"
                            >
                                Lihat semua
                            </Link>
                        </div>

                        {recent_products.length === 0 ? (
                            <p className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-8 text-center text-body-md font-body-md text-on-surface-variant">
                                Belum ada iklan.
                            </p>
                        ) : (
                            <ul className="divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                                {recent_products.map((product) => (
                                    <li key={product.id} className="flex items-center gap-3 px-4 py-3">
                                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                                            {product.image_url && (
                                                <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/produk/${product.slug}`}
                                                className="block truncate text-body-md font-body-md font-semibold text-on-surface hover:text-primary-container"
                                            >
                                                {product.title}
                                            </Link>
                                            <p className="truncate text-body-sm font-body-sm text-on-surface-variant">
                                                {product.seller.name} - {formatRupiah(product.price)}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-body-sm font-body-sm text-outline">{product.posted_at}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
