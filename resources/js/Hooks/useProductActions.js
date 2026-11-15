import { useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';

/**
 * Aksi wishlist dan troli yang dipakai beberapa halaman.
 * Tamu otomatis diarahkan ke /login.
 *
 * @param refresh           prop halaman yang dimuat ulang setelah aksi, mis. ['product', 'related']
 * @param onWishlistChange  (product, nextValue) => void, untuk update optimistik di daftar
 */
export default function useProductActions({ refresh = [], onWishlistChange } = {}) {
    const user = usePage().props.auth?.user;
    const isAdmin = user?.role === 'admin';
    const refreshKey = refresh.join(',');

    const toggleWishlist = useCallback(
        (product) => {
            if (!user) {
                router.visit('/login');
                return;
            }

            // Akun admin hanya untuk moderasi, bukan berbelanja.
            if (isAdmin) return;

            onWishlistChange?.(product, !product.is_wishlisted);

            router.post(
                `/wishlist/${product.slug}`,
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['counts', ...refresh],
                    onError: () => onWishlistChange?.(product, product.is_wishlisted),
                },
            );
        },
        [user, refreshKey, onWishlistChange],
    );

    const addToCart = useCallback(
        (product) => {
            if (!user) {
                router.visit('/login');
                return;
            }

            // Akun admin hanya untuk moderasi, bukan berbelanja.
            if (isAdmin) return;

            router.post(
                '/troli',
                { product_id: product.id },
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['counts', 'flash', 'errors', ...refresh],
                },
            );
        },
        [user, refreshKey],
    );

    return { toggleWishlist, addToCart };
}
