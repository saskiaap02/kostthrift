import { useCallback, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { cleanFilters } from '@/Lib/query';

const DEFAULTS = {
    q: '',
    kondisi: '', // '' | 'second' | 'baru'
    kategori: '', // slug kategori
    kampus: '', // slug kampus (area)
    urut: 'terbaru', // terbaru | termurah | terdekat_cod
};

/**
 * Filter beranda yang disinkronkan dengan server.
 * `serverFilters` = prop `filters` dari HomeController (sumber kebenaran).
 * Setiap perubahan memicu router.get('/') sehingga filter dikerjakan di database.
 */
export default function useProductFilters(serverFilters) {
    const [filters, setFilters] = useState({ ...DEFAULTS, ...serverFilters });

    // Server mengirim filter baru (mis. setelah pencarian dari navbar) -> ikuti.
    useEffect(() => {
        setFilters({ ...DEFAULTS, ...serverFilters });
    }, [serverFilters]);

    const visit = useCallback((next) => {
        router.get('/', cleanFilters(next), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['products', 'filters'],
        });
    }, []);

    const update = useCallback(
        (patch) => {
            const next = { ...filters, ...patch };
            setFilters(next);
            visit(next);
        },
        [filters, visit],
    );

    // Atur ulang semua filter, kata kunci pencarian tetap dipertahankan.
    const reset = useCallback(() => {
        const next = { ...DEFAULTS, q: filters.q };
        setFilters(next);
        visit(next);
    }, [filters.q, visit]);

    const hasActiveFilters =
        filters.kondisi !== '' ||
        filters.kategori !== '' ||
        filters.kampus !== '' ||
        filters.urut !== DEFAULTS.urut;

    return { filters, update, reset, hasActiveFilters };
}
