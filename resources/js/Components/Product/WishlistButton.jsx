import Icon from '@/Components/UI/Icon';

/** Tombol hati di pojok kanan atas kartu produk. State dipegang parent (lihat Home.jsx). */
export default function WishlistButton({ active = false, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-pressed={active}
            aria-label={active ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/80 shadow-sm backdrop-blur-md transition-colors hover:text-error ${
                active ? 'text-error' : 'text-outline'
            }`}
        >
            <Icon name={active ? 'heart-fill' : 'heart'} className="text-[15px]" />
        </button>
    );
}
