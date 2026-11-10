import { useCallback, useState } from 'react';

const DEFAULTS = {
    kondisi: '', // '' | 'second' | 'baru'
    kategori: '', // slug kategori, '' = semua
    kampus: '', // slug kampus (area), '' = semua
    urut: 'terbaru', // terbaru | termurah | terdekat_cod
};

/**
 * State filter beranda.
 * Langkah 3: hanya state lokal.
 * Langkah 4: `update` dan `reset` diganti router.get('/', filters, { preserveState: true, only: [...] }).
 */
export default function useProductFilters(initial = {}) {
    const [filters, setFilters] = useState({ ...DEFAULTS, ...initial });

    const update = useCallback(
        (patch) => setFilters((previous) => ({ ...previous, ...patch })),
        [],
    );

    const reset = useCallback(() => setFilters({ ...DEFAULTS }), []);

    const hasActiveFilters = Object.keys(DEFAULTS).some((key) => filters[key] !== DEFAULTS[key]);

    return { filters, update, reset, hasActiveFilters };
}
