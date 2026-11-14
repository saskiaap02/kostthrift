import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';
import { cleanFilters } from '@/Lib/query';

export default function SearchBar({ className = '' }) {
    // `filters` hanya ada di Beranda; di halaman lain undefined.
    const { filters } = usePage().props;
    const [query, setQuery] = useState(filters?.q ?? '');

    useEffect(() => {
        setQuery(filters?.q ?? '');
    }, [filters?.q]);

    const submit = (event) => {
        event.preventDefault();
        // Pertahankan filter lain, ganti kata kunci.
        router.get('/', cleanFilters({ ...filters, q: query.trim() }), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} role="search" className={className}>
            <div className="flex w-full items-stretch overflow-hidden rounded-full border-2 border-primary-container bg-surface-container-low transition-shadow focus-within:shadow-[0_0_0_3px_rgba(27,58,140,0.15)]">
                <span className="flex items-center pl-4 text-outline">
                    <Icon name="search" className="text-[15px]" />
                </span>
                <label htmlFor="search-q" className="sr-only">
                    Cari barang
                </label>
                <input
                    id="search-q"
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari kipas angin, rice cooker, buku..."
                    className="min-w-0 flex-1 border-none bg-transparent px-3 py-2.5 text-body-md font-body-md text-on-surface ring-0 placeholder:text-outline focus:outline-none focus:ring-0"
                />
                <button
                    type="submit"
                    className="bg-primary-container px-6 text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary"
                >
                    Cari
                </button>
            </div>
        </form>
    );
}
