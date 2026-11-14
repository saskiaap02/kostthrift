import { useMemo, useState } from 'react';
import FormField, { inputClass } from '@/Components/UI/FormField';

/**
 * Pilih Universitas lalu Kampus (bertingkat).
 * `value` = id kampus terpilih ('' jika belum), `onChange(id)` dipanggil saat berubah.
 * `campuses` = [{ id, name, city, university: { slug, name } }]
 */
export default function CampusSelect({ campuses, value, onChange, error }) {
    const selected = campuses.find((campus) => campus.id === Number(value));
    const [university, setUniversity] = useState(selected?.university.slug ?? '');

    const universities = useMemo(() => {
        const map = new Map();
        campuses.forEach((campus) => map.set(campus.university.slug, campus.university));
        return [...map.values()];
    }, [campuses]);

    const options = campuses.filter((campus) => campus.university.slug === university);

    const changeUniversity = (slug) => {
        setUniversity(slug);
        const list = campuses.filter((campus) => campus.university.slug === slug);
        // Universitas dengan satu kampus: langsung terpilih.
        onChange(list.length === 1 ? list[0].id : '');
    };

    return (
        <div className="space-y-4">
            <FormField label="Universitas" htmlFor="university">
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

            <FormField label="Kampus" htmlFor="campus_id" error={error}>
                <select
                    id="campus_id"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={!university}
                    className={`${inputClass} pr-9`}
                >
                    <option value="">{university ? 'Pilih kampus' : 'Pilih universitas dulu'}</option>
                    {options.map((campus) => (
                        <option key={campus.id} value={campus.id}>
                            {campus.city === campus.name ? campus.name : `${campus.name} (${campus.city})`}
                        </option>
                    ))}
                </select>
            </FormField>
        </div>
    );
}
