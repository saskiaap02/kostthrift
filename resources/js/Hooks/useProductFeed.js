import { useCallback, useEffect, useState } from 'react';
import { cleanFilters } from '@/Lib/query';

/**
 * Daftar produk di Beranda.
 * - Halaman pertama datang dari props Inertia (`products`).
 * - "Muat lebih banyak" mengambil halaman berikutnya dari GET /produk (JSON)
 *   lalu menambahkannya ke daftar tanpa mengubah URL.
 *
 * @param initialProducts  prop `products` = { data, meta }
 * @param filters          prop `filters` dari server (filter yang sedang aktif)
 */
export default function useProductFeed(initialProducts, filters) {
    const [items, setItems] = useState(initialProducts.data);
    const [meta, setMeta] = useState(initialProducts.meta);
    const [loading, setLoading] = useState(false);

    // Server mengirim hasil baru (filter/pencarian berubah) -> mulai dari halaman 1.
    useEffect(() => {
        setItems(initialProducts.data);
        setMeta(initialProducts.meta);
    }, [initialProducts]);

    const hasMore = meta.current_page < meta.last_page;

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const { data } = await window.axios.get('/produk', {
                params: { ...cleanFilters(filters), page: meta.current_page + 1 },
            });
            setItems((previous) => [...previous, ...data.data]);
            setMeta(data.meta);
        } finally {
            setLoading(false);
        }
    }, [filters, hasMore, loading, meta.current_page]);

    /** Ubah satu produk di daftar (mis. is_wishlisted) tanpa memuat ulang. */
    const patchItem = useCallback((id, patch) => {
        setItems((previous) => previous.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    }, []);

    return { items, total: meta.total, hasMore, loading, loadMore, patchItem };
}
