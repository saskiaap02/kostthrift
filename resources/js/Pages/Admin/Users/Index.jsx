import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import ReasonDialog from '@/Components/UI/ReasonDialog';
import Pagination from '@/Components/UI/Pagination';
import { cleanFilters } from '@/Lib/query';

const TABS = [
    { value: '', label: 'Semua' },
    { value: 'active', label: 'Aktif' },
    { value: 'suspended', label: 'Diblokir' },
];

/**
 * Props dari Admin\UserDirectoryController@index:
 *   users    { data: [AdminUserResource], meta, links }
 *   filters  { q, akun }  akun: '' | active | suspended
 */
export default function Index({ users, filters }) {
    const { errors } = usePage().props;
    const [query, setQuery] = useState(filters.q);
    const [blocking, setBlocking] = useState(null);   // pengguna yang akan diblokir
    const [restoring, setRestoring] = useState(null); // pengguna yang akan diaktifkan lagi
    const [busy, setBusy] = useState(false);

    const visit = (next) =>
        router.get('/admin/pengguna', cleanFilters(next), { preserveState: true, preserveScroll: true });

    const search = (event) => {
        event.preventDefault();
        visit({ ...filters, q: query.trim() });
    };

    const block = (reason) => {
        setBusy(true);
        router.post(`/admin/pengguna/${blocking.id}/blokir`, { reason }, {
            preserveScroll: true,
            onSuccess: () => setBlocking(null),
            onFinish: () => setBusy(false),
        });
    };

    const restore = () => {
        setBusy(true);
        router.delete(`/admin/pengguna/${restoring.id}/blokir`, {
            preserveScroll: true,
            onSuccess: () => setRestoring(null),
            onFinish: () => setBusy(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Pengguna (Admin)" />

            <div className="w-full max-w-[1000px]">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Pengguna
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    {users.meta.total} pengguna{filters.akun === 'suspended' ? ' diblokir' : filters.akun === 'active' ? ' aktif' : ' terdaftar'} (tidak termasuk admin).
                </p>

                <div role="tablist" aria-label="Status akun" className="mt-4 flex gap-2">
                    {TABS.map((tab) => {
                        const active = filters.akun === tab.value;
                        return (
                            <button
                                key={tab.value || 'semua'}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => visit({ ...filters, akun: tab.value })}
                                className={`h-9 rounded-full px-4 text-label-md font-label-md transition-colors ${
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

                <form
                    role="search"
                    onSubmit={search}
                    className="mt-5 flex w-full items-stretch overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest md:w-96"
                >
                    <label htmlFor="user-search" className="sr-only">
                        Cari pengguna
                    </label>
                    <input
                        id="user-search"
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cari nama atau email"
                        className="min-w-0 flex-1 border-none bg-transparent px-3 py-2.5 text-body-md font-body-md ring-0 placeholder:text-outline focus:outline-none focus:ring-0"
                    />
                    <button type="submit" aria-label="Cari" className="bg-primary-container px-4 text-white hover:bg-tertiary">
                        <Icon name="search" className="text-[14px]" />
                    </button>
                </form>

                {users.data.length === 0 ? (
                    <p className="mt-6 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-12 text-center text-body-md font-body-md text-on-surface-variant">
                        Tidak ada pengguna yang cocok.
                    </p>
                ) : (
                    <ul className="mt-5 divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                        {users.data.map((user) => (
                            <li
                                key={user.id}
                                className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-body-md font-body-md font-semibold text-on-surface">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-body-sm font-body-sm text-on-surface-variant">{user.email}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm font-body-sm text-on-surface-variant">
                                    <span className="flex items-center gap-1.5">
                                        <Icon name="geo-alt" className="text-[12px] text-outline" />
                                        {user.campus ?? 'Kampus belum dipilih'}
                                    </span>
                                    <span>Bergabung {user.joined_at}</span>
                                    {user.suspended && (
                                        <span
                                            title={user.suspended_reason ?? undefined}
                                            className="flex items-center gap-1 rounded-full bg-error/10 px-2.5 py-0.5 text-label-sm font-label-sm font-bold text-error"
                                        >
                                            <Icon name="slash-circle" className="text-[11px]" />
                                            Diblokir {user.suspended_at}
                                        </span>
                                    )}
                                    {user.verified ? (
                                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-label-sm font-label-sm font-bold text-emerald-700">
                                            <Icon name="patch-check-fill" className="text-[11px]" />
                                            Terverifikasi
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-sm font-label-sm font-bold text-on-surface-variant">
                                            Belum verifikasi
                                        </span>
                                    )}
                                    {user.suspended ? (
                                        <button
                                            type="button"
                                            onClick={() => setRestoring(user)}
                                            className="flex h-8 items-center gap-1 rounded-lg border border-outline-variant/60 px-3 text-label-md font-label-md font-bold text-primary-container hover:bg-surface-container-low"
                                        >
                                            <Icon name="arrow-counterclockwise" className="text-[12px]" />
                                            Aktifkan
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setBlocking(user)}
                                            className="flex h-8 items-center gap-1 rounded-lg border border-error/40 px-3 text-label-md font-label-md font-bold text-error hover:bg-error/5"
                                        >
                                            <Icon name="slash-circle" className="text-[12px]" />
                                            Blokir
                                        </button>
                                    )}
                                </div>
                                {user.suspended && user.suspended_reason && (
                                    <p className="text-body-sm font-body-sm text-error md:hidden">
                                        Alasan: {user.suspended_reason}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <Pagination links={users.links} meta={users.meta} />
            </div>

            <ReasonDialog
                open={Boolean(blocking)}
                title={`Blokir ${blocking?.name}?`}
                description="Akun tidak bisa masuk lagi, semua iklannya disembunyikan dari katalog, dan pesanannya yang belum dibayar dibatalkan. Alasan ditampilkan kepada pengguna saat mencoba masuk."
                placeholder="Mis. Terbukti menipu pembeli, dilaporkan beberapa pengguna."
                confirmLabel="Blokir akun"
                error={errors.reason}
                processing={busy}
                onCancel={() => setBlocking(null)}
                onSubmit={block}
            />

            <ConfirmDialog
                open={Boolean(restoring)}
                title="Aktifkan akun ini lagi?"
                message={`${restoring?.name} akan bisa masuk kembali dan iklannya tampil lagi di katalog.`}
                confirmLabel="Ya, aktifkan"
                processing={busy}
                onConfirm={restore}
                onCancel={() => setRestoring(null)}
            />
        </AdminLayout>
    );
}
