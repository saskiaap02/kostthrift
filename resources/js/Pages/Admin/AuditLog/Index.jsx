import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Icon from '@/Components/UI/Icon';
import Pagination from '@/Components/UI/Pagination';
import { cleanFilters } from '@/Lib/query';

const BADGE = {
    ktm_approved: 'bg-emerald-100 text-emerald-700',
    ktm_rejected: 'bg-amber-100 text-amber-800',
    product_taken_down: 'bg-error/10 text-error',
    report_dismissed: 'bg-surface-container text-on-surface-variant',
    report_resolved: 'bg-error/10 text-error',
    user_suspended: 'bg-error/10 text-error',
    user_unsuspended: 'bg-emerald-100 text-emerald-700',
};

/**
 * Props dari Admin\AuditLogController@index:
 *   entries  { data: [AdminActionResource], meta, links }
 *   filters  { action }
 *   actions  [{ value, label }]  untuk filter
 */
export default function Index({ entries, filters, actions }) {
    const tabs = [{ value: '', label: 'Semua' }, ...actions];

    return (
        <AdminLayout>
            <Head title="Log Aksi (Admin)" />

            <div className="w-full max-w-[1000px]">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Log Aksi
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Catatan tindakan admin: siapa melakukan apa, dan kapan. Hanya bisa dibaca.
                </p>

                <div role="tablist" aria-label="Jenis aksi" className="mt-5 flex gap-2 overflow-x-auto pb-1">
                    {tabs.map((tab) => {
                        const active = filters.action === tab.value;
                        return (
                            <button
                                key={tab.value || 'semua'}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() =>
                                    router.get('/admin/log', cleanFilters({ action: tab.value }), {
                                        preserveState: true,
                                        preserveScroll: true,
                                    })
                                }
                                className={`h-9 shrink-0 rounded-full px-4 text-label-md font-label-md transition-colors ${
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

                {entries.data.length === 0 ? (
                    <p className="mt-6 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-12 text-center text-body-md font-body-md text-on-surface-variant">
                        Belum ada aksi yang tercatat.
                    </p>
                ) : (
                    <ul className="mt-5 divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                        {entries.data.map((entry) => (
                            <li key={entry.id} className="flex flex-col gap-1.5 px-4 py-3 md:flex-row md:items-start md:gap-4">
                                <span
                                    className={`h-fit w-fit shrink-0 rounded-full px-2.5 py-0.5 text-label-sm font-label-sm font-bold md:w-36 md:text-center ${
                                        BADGE[entry.action] ?? 'bg-surface-container text-on-surface-variant'
                                    }`}
                                >
                                    {entry.action_label}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-body-md font-body-md font-semibold text-on-surface">{entry.summary}</p>
                                    {entry.reason && (
                                        <p className="mt-0.5 text-body-sm font-body-sm text-on-surface-variant">
                                            Alasan: {entry.reason}
                                        </p>
                                    )}
                                    <p className="mt-0.5 flex items-center gap-1.5 text-body-sm font-body-sm text-outline">
                                        <Icon name="person-badge" className="text-[12px]" />
                                        {entry.admin} · <span title={entry.ago}>{entry.at}</span>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <Pagination links={entries.links} meta={entries.meta} />
            </div>
        </AdminLayout>
    );
}
