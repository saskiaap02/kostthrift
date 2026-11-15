import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import Pagination from '@/Components/UI/Pagination';
import { cleanFilters } from '@/Lib/query';

/**
 * Props dari Admin\UserDirectoryController@index:
 *   users    { data: [AdminUserResource], meta, links }
 *   filters  { q }
 */
export default function Index({ users, filters }) {
    const [query, setQuery] = useState(filters.q);

    const search = (event) => {
        event.preventDefault();
        router.get('/admin/pengguna', cleanFilters({ q: query.trim() }), {
            preserveState: true,
            preserveScroll: true,
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
                    {users.meta.total} pengguna terdaftar (tidak termasuk admin).
                </p>

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
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <Pagination links={users.links} meta={users.meta} />
            </div>
        </AdminLayout>
    );
}
