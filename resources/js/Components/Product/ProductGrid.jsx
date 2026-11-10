import Icon from '@/Components/UI/Icon';
import ProductCard from '@/Components/Product/ProductCard';

export default function ProductGrid({ products = [], onToggleWishlist, onAddToCart }) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-16 text-center">
                <Icon name="inbox" className="text-[36px] text-outline" />
                <p className="mt-2 font-headline-sm text-headline-sm text-on-surface">Barang tidak ditemukan</p>
                <p className="text-body-md font-body-md text-on-surface-variant">
                    Coba ubah filter atau kata kunci pencarianmu.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-gutter-mobile sm:grid-cols-3 md:gap-gutter lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}
