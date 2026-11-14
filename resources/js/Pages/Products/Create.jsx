import { useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import FormField, { inputClass, textareaClass } from '@/Components/UI/FormField';
import ImagePicker from '@/Components/Product/ImagePicker';
import { formatRupiah } from '@/Lib/format';

const CONDITIONS = [
    { value: 'second', label: 'Second', hint: 'Pernah dipakai, kondisi masih baik' },
    { value: 'baru', label: 'Baru', hint: 'Belum pernah dipakai / masih segel' },
];

/** Ambil hanya angka: "Rp 115.000" -> "115000" */
const digits = (value) => value.replace(/\D/g, '');

function Section({ icon, title, children }) {
    return (
        <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-headline-sm text-body-lg font-bold text-on-surface">
                <Icon name={icon} className="text-[16px] text-primary-container" />
                {title}
            </h2>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function RupiahInput({ id, value, onChange, placeholder, invalid }) {
    return (
        <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-body-md font-semibold text-outline">
                Rp
            </span>
            <input
                id={id}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={value ? Number(value).toLocaleString('id-ID') : ''}
                onChange={(event) => onChange(digits(event.target.value))}
                placeholder={placeholder}
                aria-invalid={invalid}
                className={`${inputClass} pl-10 tabular-nums`}
            />
        </div>
    );
}

/**
 * Props dari ProductController@create:
 *   categories         [{ id, slug, name, icon }]
 *   campuses           [{ id, slug, name, city, label, university: { slug, name, short_name } }]
 *   default_campus_id  kampus penjual (pilihan awal), boleh null
 */
export default function Create({ categories, campuses, default_campus_id }) {
    const defaultCampus = campuses.find((campus) => campus.id === default_campus_id);
    const [university, setUniversity] = useState(defaultCampus?.university.slug ?? '');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: '',
        condition: 'second',
        price: '',
        original_price: '',
        description: '',
        campus_id: defaultCampus?.id ?? '',
        location_note: '',
        images: [],
    });

    const universities = useMemo(() => {
        const map = new Map();
        campuses.forEach((campus) => map.set(campus.university.slug, campus.university));
        return [...map.values()];
    }, [campuses]);

    const campusOptions = campuses.filter((campus) => campus.university.slug === university);
    const selectedCampus = campuses.find((campus) => campus.id === Number(data.campus_id));
    const locationPreview = selectedCampus
        ? [data.location_note.trim(), selectedCampus.label].filter(Boolean).join(', ')
        : null;

    const changeUniversity = (slug) => {
        setUniversity(slug);
        const options = campuses.filter((campus) => campus.university.slug === slug);
        // Kalau universitasnya hanya punya satu kampus, langsung terpilih.
        setData('campus_id', options.length === 1 ? options[0].id : '');
    };

    const imageError = Object.entries(errors).find(([key]) => key === 'images' || key.startsWith('images.'))?.[1];

    const submit = (event) => {
        event.preventDefault();
        post('/produk', {
            forceFormData: true,
            preserveScroll: true,
            // Gulir ke pesan error pertama supaya kegagalan tidak terlewat.
            onError: () =>
                setTimeout(
                    () => document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
                    50,
                ),
        });
    };

    const errorMessages = [...new Set(Object.values(errors))];

    return (
        <MarketLayout>
            <Head title="Jual Barang" />

            <form onSubmit={submit} className="mx-auto w-full max-w-3xl space-y-5 px-margin-mobile pb-6 pt-6 md:px-margin">
                <div>
                    <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                        Jual Barang
                    </h1>
                    <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                        Pasang iklan perlengkapan kos-mu. Foto yang jelas dan deskripsi jujur membuat barang lebih cepat
                        terjual.
                    </p>
                </div>

                <Section icon="camera" title="Foto Barang">
                    <ImagePicker
                        files={data.images}
                        onChange={(files) => setData('images', files)}
                        error={imageError}
                    />
                </Section>

                <Section icon="card-text" title="Detail Barang">
                    <FormField label="Judul" htmlFor="title" required error={errors.title}>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(event) => setData('title', event.target.value)}
                            placeholder="Mis. Rice Cooker Mini 0,8L Mulus"
                            maxLength={100}
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Kategori" htmlFor="category_id" required error={errors.category_id}>
                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={(event) => setData('category_id', event.target.value)}
                            className={`${inputClass} pr-9`}
                        >
                            <option value="">Pilih kategori</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Kondisi" required error={errors.condition}>
                        <div role="radiogroup" aria-label="Kondisi barang" className="grid gap-3 sm:grid-cols-2">
                            {CONDITIONS.map((item) => {
                                const active = data.condition === item.value;
                                return (
                                    <label
                                        key={item.value}
                                        className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-colors ${
                                            active
                                                ? 'border-primary-container bg-primary-fixed/20'
                                                : 'border-outline-variant/50 hover:border-primary-container/50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="condition"
                                            value={item.value}
                                            checked={active}
                                            onChange={() => setData('condition', item.value)}
                                            className="mt-0.5 h-4 w-4 border-outline text-primary-container focus:ring-primary-container"
                                        />
                                        <span>
                                            <span className="block text-label-lg font-label-lg font-bold text-on-surface">
                                                {item.label}
                                            </span>
                                            <span className="block text-body-sm font-body-sm text-on-surface-variant">
                                                {item.hint}
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </FormField>

                    <FormField
                        label="Deskripsi"
                        htmlFor="description"
                        required
                        error={errors.description}
                        hint="Ceritakan kondisi, lama pemakaian, kelengkapan, dan alasan menjual."
                    >
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(event) => setData('description', event.target.value)}
                            maxLength={2000}
                            className={textareaClass}
                        />
                    </FormField>
                </Section>

                <Section icon="cash-coin" title="Harga">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Harga jual" htmlFor="price" required error={errors.price}>
                            <RupiahInput
                                id="price"
                                value={data.price}
                                onChange={(value) => setData('price', value)}
                                placeholder="115.000"
                                invalid={Boolean(errors.price)}
                            />
                        </FormField>
                        <FormField
                            label="Harga asli (opsional)"
                            htmlFor="original_price"
                            error={errors.original_price}
                            hint="Ditampilkan sebagai harga coret agar pembeli tahu hematnya."
                        >
                            <RupiahInput
                                id="original_price"
                                value={data.original_price}
                                onChange={(value) => setData('original_price', value)}
                                placeholder="250.000"
                                invalid={Boolean(errors.original_price)}
                            />
                        </FormField>
                    </div>
                    {data.price && data.original_price && Number(data.original_price) > Number(data.price) && (
                        <p className="text-body-sm font-body-sm text-emerald-700">
                            Pembeli akan melihat hemat{' '}
                            {Math.round((1 - Number(data.price) / Number(data.original_price)) * 100)}% dari{' '}
                            {formatRupiah(data.original_price)}.
                        </p>
                    )}
                </Section>

                <Section icon="geo-alt" title="Lokasi COD">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Universitas" htmlFor="university" required>
                            <select
                                id="university"
                                value={university}
                                onChange={(event) => changeUniversity(event.target.value)}
                                className={`${inputClass} pr-9`}
                            >
                                <option value="">Pilih universitas</option>
                                {universities.map((item) => (
                                    <option key={item.slug} value={item.slug}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Kampus" htmlFor="campus_id" required error={errors.campus_id}>
                            <select
                                id="campus_id"
                                value={data.campus_id}
                                onChange={(event) => setData('campus_id', event.target.value)}
                                disabled={!university}
                                className={`${inputClass} pr-9`}
                            >
                                <option value="">{university ? 'Pilih kampus' : 'Pilih universitas dulu'}</option>
                                {campusOptions.map((campus) => (
                                    <option key={campus.id} value={campus.id}>
                                        {campus.city === campus.name ? campus.name : `${campus.name} (${campus.city})`}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>

                    <FormField
                        label="Detail area (opsional)"
                        htmlFor="location_note"
                        error={errors.location_note}
                        hint="Mis. nama kawasan kos atau titik temu COD."
                    >
                        <input
                            id="location_note"
                            type="text"
                            value={data.location_note}
                            onChange={(event) => setData('location_note', event.target.value)}
                            placeholder="Mis. Kukusan, depan perpustakaan pusat"
                            maxLength={80}
                            className={inputClass}
                        />
                    </FormField>

                    {locationPreview && (
                        <p className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3.5 py-2.5 text-body-md font-body-md text-on-surface-variant">
                            <Icon name="geo-alt-fill" className="text-[14px] text-primary-container" />
                            <span>
                                Akan tampil sebagai <strong className="text-on-surface">{locationPreview}</strong>
                            </span>
                        </p>
                    )}
                </Section>

                {errorMessages.length > 0 && (
                    <div className="rounded-xl border border-error/30 bg-error/5 p-4 text-body-md font-body-md text-error">
                        <p className="flex items-center gap-2 font-bold">
                            <Icon name="exclamation-circle-fill" className="text-[16px]" />
                            Iklan belum bisa dipasang. Periksa hal berikut:
                        </p>
                        <ul className="mt-2 list-disc space-y-0.5 pl-9">
                            {errorMessages.map((message) => (
                                <li key={message}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Link
                        href="/"
                        className="flex h-12 items-center justify-center rounded-xl border border-outline-variant/60 px-6 text-label-lg font-label-lg font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-container px-8 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary active:scale-[0.98] disabled:opacity-60"
                    >
                        {processing ? (
                            <>
                                <Icon name="arrow-repeat" className="animate-spin text-[14px]" />
                                Mengunggah...
                            </>
                        ) : (
                            'Pasang Iklan'
                        )}
                    </button>
                </div>
            </form>
        </MarketLayout>
    );
}
