import { Link } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';
import Price from '@/Components/UI/Price';
import ConditionBadge from '@/Components/UI/ConditionBadge';
import VerifiedBadge from '@/Components/UI/VerifiedBadge';
import WishlistButton from '@/Components/Product/WishlistButton';

/**
 * Bentuk `product` = ProductResource:
 * {
 *   id, slug, title, price, original_price, discount_percent,
 *   condition: 'baru' | 'second', condition_label,
 *   location_label, image_url, is_wishlisted,
 *   seller: { name, ktm_verified }
 * }
 */
export default function ProductCard({ product, onToggleWishlist, onAddToCart }) {
    const {
        slug,
        title,
        price,
        original_price,
        condition,
        condition_label,
        location_label,
        image_url,
        is_wishlisted,
        status,
        seller,
    } = product;

    const sold = status !== 'active'; // terjual atau sedang dipesan
    const soldLabel = status === 'reserved' ? 'Dipesan' : 'Terjual';

    const href = `/produk/${slug}`;

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-[0_8px_24px_-4px_rgba(27,58,140,0.12)]">
            <div className="relative aspect-square w-full overflow-hidden bg-surface-container-low">
                <Link href={href} className="block h-full w-full" aria-label={`Lihat ${title}`}>
                    {image_url ? (
                        <img
                            src={image_url}
                            alt={title}
                            loading="lazy"
                            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                sold ? 'opacity-50 grayscale' : ''
                            }`}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-outline">
                            <Icon name="image" className="text-[32px]" />
                        </div>
                    )}
                </Link>
                {sold ? (
                    <span className="absolute left-2 top-2 rounded-full bg-on-surface/80 px-2 py-0.5 text-label-sm font-label-sm font-bold text-white">
                        {soldLabel}
                    </span>
                ) : (
                    <ConditionBadge
                        condition={condition}
                        label={condition_label}
                        className="absolute left-2 top-2"
                    />
                )}
                <WishlistButton active={is_wishlisted} onToggle={() => onToggleWishlist?.(product)} />
            </div>

            <div className="flex flex-1 flex-col justify-between p-space-sm md:p-space-md">
                <div>
                    {seller?.ktm_verified && <VerifiedBadge className="mb-1" />}
                    <h3 className="line-clamp-2 font-headline-sm text-body-md font-semibold leading-tight text-on-surface">
                        <Link href={href} className="hover:text-primary-container">
                            {title}
                        </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-body-sm text-outline md:text-body-sm">
                        <Icon name="geo-alt-fill" className="text-[11px]" />
                        <span>{location_label}</span>
                    </p>
                </div>

                <div className="mt-2.5 border-t border-surface-container-low pt-2">
                    <Price price={price} originalPrice={original_price} />
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                        <button
                            type="button"
                            onClick={() => onAddToCart?.(product)}
                            disabled={sold}
                            className="flex h-9 items-center justify-center gap-0.5 rounded-lg bg-primary-container text-label-sm font-label-sm font-bold text-surface-container-lowest transition-transform hover:bg-tertiary active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant disabled:active:scale-100"
                        >
                            <Icon name={sold ? 'x-circle' : 'bag-plus'} className="text-[14px]" />
                            <span>{sold ? soldLabel : 'Troli'}</span>
                        </button>
                        <Link
                            href={href}
                            className="flex h-9 items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-low text-label-sm font-label-sm font-semibold text-on-surface-variant transition-transform hover:text-primary active:scale-95"
                        >
                            Detail
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
