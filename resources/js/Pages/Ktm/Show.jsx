import { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import FormField, { inputClass } from '@/Components/UI/FormField';

const PRIVACY_POINTS = [
    { icon: 'eye-slash', text: 'Hanya admin KosThrift yang bisa melihat foto KTM-mu. Pengguna lain tidak pernah bisa.' },
    { icon: 'trash3', text: 'Foto dihapus permanen begitu pemeriksaan selesai (disetujui maupun ditolak).' },
    { icon: 'lock', text: 'Foto disimpan privat dan metadatanya (termasuk lokasi) dibuang.' },
    { icon: 'info-circle', text: 'Kamu boleh menutup NIM dan alamat. Nama, universitas, dan masa berlaku harus terbaca jelas.' },
];

function StatusCard({ icon, tone, title, children }) {
    const tones = {
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        info: 'border-primary-container/20 bg-primary-fixed/20 text-primary',
        error: 'border-error/30 bg-error/5 text-error',
    };

    return (
        <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
            <p className="flex items-center gap-2 font-headline-sm text-body-lg font-bold">
                <Icon name={icon} className="text-[18px]" />
                {title}
            </p>
            <div className="mt-2 text-body-md font-body-md">{children}</div>
        </div>
    );
}

/**
 * Props dari KtmVerificationController@show:
 *   verified       boolean, akun sudah terverifikasi
 *   verification   pengajuan terakhir { status, status_label, rejection_reason, submitted_at } atau null
 *   universities   [{ id, name }]
 */
export default function Show({ verified, verification, universities }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        document: null,
        university_id: '',
        consent: false,
    });

    useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

    const choose = (file) => {
        if (!file) return;
        setData('document', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (event) => {
        event.preventDefault();
        post('/verifikasi-ktm', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    const pending = verification?.status === 'pending';
    const rejected = verification?.status === 'rejected';
    const showForm = !verified && !pending;

    return (
        <MarketLayout>
            <Head title="Verifikasi KTM" />

            <div className="mx-auto w-full max-w-[1000px] px-margin-mobile pb-4 pt-6 md:px-margin">
                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    Verifikasi KTM
                </h1>
                <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                    KosThrift khusus mahasiswa. Penjual dan pembeli wajib terverifikasi sebagai mahasiswa aktif sebelum memasang
                    iklan atau checkout.
                </p>

                <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-4">
                        {verified && (
                            <StatusCard icon="check-circle-fill" tone="success" title="Akunmu sudah terverifikasi">
                                <p>Kamu sudah bisa memasang iklan dan checkout. Badge "Terverifikasi KTM" tampil di profil dan iklanmu.</p>
                                <Link
                                    href="/jual"
                                    className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-container px-5 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary"
                                >
                                    <Icon name="plus-lg" className="text-[13px]" />
                                    Pasang iklan
                                </Link>
                            </StatusCard>
                        )}

                        {pending && (
                            <StatusCard icon="hourglass-split" tone="info" title="KTM-mu sedang diperiksa">
                                <p>
                                    Dikirim {verification.submitted_at}
                                    {verification.university ? ` untuk ${verification.university}` : ''}. Kamu akan
                                    melihat hasilnya di halaman ini.
                                </p>
                            </StatusCard>
                        )}

                        {rejected && !verified && (
                            <StatusCard icon="exclamation-circle-fill" tone="error" title="Pengajuan sebelumnya ditolak">
                                <p>
                                    Alasan: <strong>{verification.rejection_reason}</strong>
                                </p>
                                <p className="mt-1">Kirim ulang dengan foto yang sudah diperbaiki.</p>
                            </StatusCard>
                        )}

                        {showForm && (
                            <form
                                onSubmit={submit}
                                className="space-y-5 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-6"
                            >
                                <FormField label="Universitas" htmlFor="university_id" required error={errors.university_id}>
                                    <select
                                        id="university_id"
                                        value={data.university_id}
                                        onChange={(event) => setData('university_id', event.target.value)}
                                        className={`${inputClass} pr-9`}
                                    >
                                        <option value="">Pilih universitas</option>
                                        {universities.map((university) => (
                                            <option key={university.id} value={university.id}>
                                                {university.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Foto KTM" required error={errors.document}>
                                    <button
                                        type="button"
                                        onClick={() => inputRef.current?.click()}
                                        className="flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-4 text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary-container"
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Pratinjau KTM" className="max-h-56 rounded-lg object-contain" />
                                        ) : (
                                            <>
                                                <Icon name="camera" className="text-[28px]" />
                                                <span className="text-label-lg font-label-lg font-bold">Pilih foto KTM</span>
                                                <span className="text-body-sm font-body-sm">JPG atau PNG, maksimal 4 MB</span>
                                            </>
                                        )}
                                    </button>
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        className="sr-only"
                                        tabIndex={-1}
                                        onChange={(event) => choose(event.target.files?.[0])}
                                    />
                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={() => inputRef.current?.click()}
                                            className="mt-2 text-body-sm font-body-sm font-bold text-primary-container hover:underline"
                                        >
                                            Ganti foto
                                        </button>
                                    )}
                                </FormField>

                                <div>
                                    <label className="flex cursor-pointer items-start gap-2.5 text-body-md font-body-md text-on-surface-variant">
                                        <input
                                            type="checkbox"
                                            checked={data.consent}
                                            onChange={(event) => setData('consent', event.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-outline text-primary-container focus:ring-primary-container"
                                        />
                                        <span>
                                            Saya setuju foto KTM-ku diperiksa admin KosThrift untuk verifikasi, lalu
                                            dihapus setelah proses selesai.
                                        </span>
                                    </label>
                                    {errors.consent && (
                                        <p role="alert" className="mt-1.5 text-body-sm font-body-sm font-semibold text-error">
                                            {errors.consent}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary active:scale-[0.99] disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <Icon name="arrow-repeat" className="animate-spin text-[14px]" />
                                            Mengunggah...
                                        </>
                                    ) : (
                                        'Kirim untuk Diverifikasi'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    <aside className="rounded-2xl bg-surface-container-low/70 p-5">
                        <h2 className="mb-3 flex items-center gap-2 font-headline-sm text-body-lg font-bold text-on-surface">
                            <Icon name="shield-lock" className="text-[16px] text-primary" />
                            Keamanan datamu
                        </h2>
                        <ul className="space-y-3">
                            {PRIVACY_POINTS.map((item) => (
                                <li
                                    key={item.icon}
                                    className="flex items-start gap-2.5 text-body-sm font-body-sm text-on-surface-variant md:text-body-md"
                                >
                                    <Icon name={item.icon} className="mt-0.5 text-[14px] text-primary" />
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
        </MarketLayout>
    );
}
