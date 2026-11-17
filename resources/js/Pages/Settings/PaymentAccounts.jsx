import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import FormField, { inputClass } from '@/Components/UI/FormField';

const PROVIDERS = {
    bank: ['BCA', 'BRI', 'BNI', 'Mandiri', 'BSI', 'CIMB Niaga', 'Permata', 'BTN', 'Jago', 'SeaBank'],
    ewallet: ['GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'],
};

/**
 * Props dari PaymentAccountController@index:
 *   accounts  [{ id, type, type_label, provider, account_name, masked_number }]
 *   types     [{ value, label }]
 *   max       batas jumlah akun
 */
export default function PaymentAccounts({ accounts, types, max }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'bank',
        provider: '',
        account_name: '',
        account_number: '',
    });
    const [target, setTarget] = useState(null);
    const [busy, setBusy] = useState(false);

    const submit = (event) => {
        event.preventDefault();
        post('/pengaturan/pembayaran', { preserveScroll: true, onSuccess: () => reset() });
    };

    const remove = () => {
        setBusy(true);
        router.delete(`/pengaturan/pembayaran/${target.id}`, {
            preserveScroll: true,
            onSuccess: () => setTarget(null),
            onFinish: () => setBusy(false),
        });
    };

    const full = accounts.length >= max;

    return (
        <MarketLayout>
            <Head title="Rekening Pembayaran" />

            <div className="mx-auto w-full max-w-[800px] px-margin-mobile pb-4 pt-6 md:px-margin">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Rekening Pembayaran
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    Tempat pembeli mentransfer jika memilih transfer langsung. Nomor disimpan terenkripsi dan hanya
                    terlihat oleh pembeli yang pesanannya kamu setujui.
                </p>

                <section className="mt-6">
                    <h2 className="mb-3 font-headline-md text-headline-sm font-bold text-on-surface">
                        Akun tersimpan ({accounts.length}/{max})
                    </h2>
                    {accounts.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-8 text-center text-body-md font-body-md text-on-surface-variant">
                            Belum ada akun. Tanpa akun, kamu hanya bisa menerima pesanan COD.
                        </p>
                    ) : (
                        <ul className="divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
                            {accounts.map((account) => (
                                <li key={account.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed/40 text-primary">
                                            <Icon name={account.type === 'bank' ? 'bank' : 'wallet2'} className="text-[16px]" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-body-md font-body-md font-semibold text-on-surface">
                                                {account.provider} - {account.masked_number}
                                            </p>
                                            <p className="truncate text-body-sm font-body-sm text-on-surface-variant">
                                                {account.type_label} atas nama {account.account_name}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setTarget(account)}
                                        aria-label={`Hapus ${account.provider}`}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error"
                                    >
                                        <Icon name="trash3" className="text-[15px]" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-8">
                    <h2 className="mb-3 font-headline-md text-headline-sm font-bold text-on-surface">Tambah akun</h2>

                    {full ? (
                        <p className="rounded-2xl bg-orange-50 p-4 text-body-md font-body-md text-orange-900">
                            Batas {max} akun sudah tercapai. Hapus salah satu untuk menambah yang baru.
                        </p>
                    ) : (
                        <form
                            onSubmit={submit}
                            className="space-y-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-5"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField label="Jenis" htmlFor="type" required error={errors.type}>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(event) => setData('type', event.target.value)}
                                        className={`${inputClass} pr-9`}
                                    >
                                        {types.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField
                                    label={data.type === 'bank' ? 'Nama bank' : 'Nama e-wallet'}
                                    htmlFor="provider"
                                    required
                                    error={errors.provider}
                                >
                                    <input
                                        id="provider"
                                        type="text"
                                        list="providers"
                                        value={data.provider}
                                        onChange={(event) => setData('provider', event.target.value)}
                                        maxLength={40}
                                        className={inputClass}
                                    />
                                    <datalist id="providers">
                                        {PROVIDERS[data.type].map((name) => (
                                            <option key={name} value={name} />
                                        ))}
                                    </datalist>
                                </FormField>
                            </div>

                            <FormField label="Nama pemilik" htmlFor="account_name" required error={errors.account_name}>
                                <input
                                    id="account_name"
                                    type="text"
                                    value={data.account_name}
                                    onChange={(event) => setData('account_name', event.target.value)}
                                    maxLength={80}
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField
                                label={data.type === 'bank' ? 'Nomor rekening' : 'Nomor e-wallet'}
                                htmlFor="account_number"
                                required
                                error={errors.account_number}
                                hint="Hanya angka. Pastikan benar, karena pembeli akan mentransfer ke nomor ini."
                            >
                                <input
                                    id="account_number"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={data.account_number}
                                    onChange={(event) => setData('account_number', event.target.value)}
                                    className={`${inputClass} tabular-nums`}
                                />
                            </FormField>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-container px-6 text-label-lg font-label-lg font-bold text-white hover:bg-tertiary disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan akun'}
                            </button>
                        </form>
                    )}
                </section>
            </div>

            <ConfirmDialog
                open={Boolean(target)}
                title="Hapus akun ini?"
                message={`${target?.provider} - ${target?.masked_number} akan dihapus. Pesanan yang sudah berjalan tidak terpengaruh.`}
                confirmLabel="Ya, hapus"
                tone="danger"
                processing={busy}
                onConfirm={remove}
                onCancel={() => setTarget(null)}
            />
        </MarketLayout>
    );
}
