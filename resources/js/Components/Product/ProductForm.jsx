import { useMemo, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import axios from 'axios';
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

function Section({ icon, title, action = null, children }) {
    return (
        <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-space-md shadow-sm md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 font-headline-sm text-body-lg font-bold text-on-surface">
                    <Icon name={icon} className="text-[16px] text-primary-container" />
                    {title}
                </h2>
                {action}
            </div>
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
 * Form iklan yang dipakai Jual (product = null) dan Edit (product = ProductFormResource).
 *
 *   categories       [{ id, name }]
 *   campuses         [{ id, name, city, label, university: { slug, name } }]
 *   defaultCampusId  kampus penjual, pilihan awal saat membuat iklan baru
 */
export default function ProductForm({ product = null, categories, campuses, defaultCampusId = null }) {
    const editing = product !== null;

    const initialCampus = campuses.find((campus) => campus.id === (editing ? product.campus_id : defaultCampusId));
    const [university, setUniversity] = useState(initialCampus?.university.slug ?? '');

    // Foto: foto lama (Edit) lebih dulu, lalu foto baru. Urutan = urutan tampil.
    const [items, setItems] = useState(() =>
        (product?.images ?? []).map((image) => ({ key: `existing-${image.id}`, id: image.id, url: image.url })),
    );

    const [aiBusy, setAiBusy] = useState(false);
    const [aiStatus, setAiStatus] = useState(null); // { type: 'success' | 'error', text: string }

    const { data, setData, post, processing, errors, transform } = useForm({
        title: product?.title ?? '',
        category_id: product?.category_id ?? '',
        condition: product?.condition ?? 'second',
        price: product ? String(product.price) : '',
        original_price: product?.original_price ? String(product.original_price) : '',
        description: product?.description ?? '',
        campus_id: initialCampus?.id ?? '',
        location_note: product?.location_note ?? '',
    });

    const firstNewFile = items.find((item) => item.file)?.file ?? null;

    const analyzePhoto = async () => {
        if (!firstNewFile || aiBusy) return;

        setAiBusy(true);
        setAiStatus(null);

        try {
            const formData = new FormData();
            formData.append('image', firstNewFile);

            const { data: res } = await axios.post('/produk/analisis-foto', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const suggestion = res?.suggestion;
            if (suggestion) {
                setData((prev) => ({
                    ...prev,
                    title: suggestion.title || prev.title,
                    category_id: suggestion.category_id ? String(suggestion.category_id) : prev.category_id,
                    condition: suggestion.condition || prev.condition,
                    description: suggestion.description || prev.description,
                    price: !prev.price && suggestion.estimated_price ? String(suggestion.estimated_price) : prev.price,
                }));
                setAiStatus({
                    type: 'success',
                    text: 'Detail barang berhasil diisi otomatis dari foto. Silakan periksa dan sesuaikan kembali.',
                });
            }
        } catch (err) {
            const msg =
                err.response?.data?.errors?.ai?.[0] ||
                err.response?.data?.errors?.image?.[0] ||
                err.response?.data?.message ||
                'Gagal menganalisis foto. Silakan coba lagi atau isi manual.';
            setAiStatus({ type: 'error', text: msg });
        } finally {
            setAiBusy(false);
        }
    };

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

    const imageError = Object.entries(errors).find(
        ([key]) => key === 'images' || key.startsWith('images.') || key === 'image_order',
    )?.[1];

    const submit = (event) => {
        event.preventDefault();

        let newIndex = 0;
        const files = items.filter((item) => item.file).map((item) => item.file);
        const order = items.map((item) => (item.id ? `existing:${item.id}` : `new:${newIndex++}`));

        transform((formData) => ({
            ...formData,
            images: files,
            // File tidak bisa dikirim lewat PUT, jadi dikirim POST dengan _method=put.
            ...(editing ? { _method: 'put', image_order: order } : {}),
        }));

        post(editing ? `/produk/${product.slug}` : '/produk', {
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

    const aiButton = !editing && (
        <button
            type="button"
            disabled={!firstNewFile || aiBusy}
            onClick={analyzePhoto}
            title={firstNewFile ? 'Isi judul, kategori, dan deskripsi otomatis dari foto pertama' : 'Unggah foto barang dulu'}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary-fixed/40 px-3.5 text-label-md font-label-md font-bold text-primary transition hover:bg-primary-fixed/70 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Icon name={aiBusy ? 'arrow-repeat' : 'stars'} className={`text-[14px] ${aiBusy ? 'animate-spin' : ''}`} />
            {aiBusy ? 'Menganalisis foto...' : 'Isi Otomatis dengan AI'}
        </button>
    );

    return (
        <form onSubmit={submit} className="space-y-5">
            <Section icon="camera" title="Foto Barang" action={aiButton}>
                <ImagePicker items={items} onChange={setItems} error={imageError} />
                {!editing && !firstNewFile && (
                    <p className="text-body-sm font-body-sm text-outline">
                        Tip: Unggah foto barang terlebih dahulu untuk menggunakan fitur isi otomatis dengan AI.
                    </p>
                )}
                {aiStatus && (
                    <p
                        role={aiStatus.type === 'error' ? 'alert' : 'status'}
                        className={`flex items-start gap-2 rounded-xl p-3 text-body-sm font-body-sm ${
                            aiStatus.type === 'success'
                                ? 'bg-emerald-50 text-emerald-900'
                                : 'bg-error/5 font-semibold text-error'
                        }`}
                    >
                        <Icon
                            name={aiStatus.type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}
                            className="mt-0.5 text-[14px]"
                        />
                        <span>{aiStatus.text}</span>
                    </p>
                )}
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
                        {editing ? 'Perubahan belum bisa disimpan.' : 'Iklan belum bisa dipasang.'} Periksa hal berikut:
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
                    href={editing ? '/iklan-saya' : '/'}
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
                            {editing ? 'Menyimpan...' : 'Mengunggah...'}
                        </>
                    ) : editing ? (
                        'Simpan Perubahan'
                    ) : (
                        'Pasang Iklan'
                    )}
                </button>
            </div>
        </form>
    );
}