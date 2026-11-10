import Icon from '@/Components/UI/Icon';

const CONDITIONS = [
    { value: '', label: 'Semua Barang' },
    { value: 'second', label: 'Barang Second' },
    { value: 'baru', label: 'Barang Baru' },
];

const SORTS = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'termurah', label: 'Harga termurah' },
    { value: 'terdekat_cod', label: 'Terdekat COD' },
];

function SelectBox({ label, value, onChange, options }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-label={label}
                className="h-10 appearance-none rounded-xl border border-outline-variant/60 bg-surface-container-lowest pl-3.5 pr-9 text-label-lg font-label-lg text-on-surface shadow-sm transition-colors hover:border-primary-container focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <Icon
                name="chevron-down"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-outline"
            />
        </div>
    );
}

/**
 * Presentational: state dipegang halaman lewat useProductFilters.
 * filters = { kondisi, kategori, kampus, urut }
 */
export default function FilterBar({ filters, categories = [], campuses = [], onChange, onReset, hasActiveFilters }) {
    const categoryOptions = [
        { value: '', label: 'Semua kategori' },
        ...categories.map((category) => ({ value: category.slug, label: category.name })),
    ];
    const areaOptions = [
        { value: '', label: 'Semua area' },
        ...campuses.map((campus) => ({ value: campus.slug, label: campus.zone_label })),
    ];

    return (
        <section
            id="filter-bar"
            className="mx-auto w-full max-w-[1200px] px-margin-mobile pt-6 md:px-margin"
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div role="tablist" aria-label="Kondisi barang" className="flex flex-wrap items-center gap-2">
                    {CONDITIONS.map((item) => {
                        const active = filters.kondisi === item.value;
                        return (
                            <button
                                key={item.value || 'semua'}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => onChange({ kondisi: item.value })}
                                className={`h-10 rounded-full px-5 text-label-lg font-label-lg transition-colors ${
                                    active
                                        ? 'bg-primary-container font-bold text-white shadow-sm'
                                        : 'border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary-container hover:text-primary-container'
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <SelectBox
                        label="Kategori"
                        value={filters.kategori}
                        options={categoryOptions}
                        onChange={(kategori) => onChange({ kategori })}
                    />
                    <SelectBox
                        label="Area kampus"
                        value={filters.kampus}
                        options={areaOptions}
                        onChange={(kampus) => onChange({ kampus })}
                    />
                    <SelectBox
                        label="Urutkan"
                        value={filters.urut}
                        options={SORTS}
                        onChange={(urut) => onChange({ urut })}
                    />
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="flex h-10 items-center gap-1.5 rounded-xl px-2 text-label-lg font-label-lg font-bold text-primary-container hover:underline"
                        >
                            <Icon name="arrow-counterclockwise" className="text-[13px]" />
                            Atur ulang
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
