import { useEffect, useState } from 'react';
import Icon from '@/Components/UI/Icon';
import ImageLightbox from '@/Components/Product/ImageLightbox';

const arrowClass =
    'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-lowest/90 text-primary shadow-md transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container';

/**
 * Galeri foto produk: foto utama dengan tombol geser kiri/kanan (juga panah keyboard),
 * thumbnail, dan klik untuk membuka layar penuh (zoom). `images` = [{ id, url }].
 */
export default function ProductGallery({ images = [], title }) {
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(false);

    const count = images.length;
    const current = images[active];

    useEffect(() => {
        if (active >= count) setActive(0);
    }, [active, count]);

    const go = (delta) => setActive((index) => (index + delta + count) % count);

    const onKeyDown = (event) => {
        if (count < 2) return;
        if (event.key === 'ArrowLeft') go(-1);
        if (event.key === 'ArrowRight') go(1);
    };

    return (
        <>
            <div onKeyDown={onKeyDown}>
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low">
                    {current ? (
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            aria-label="Perbesar foto"
                            className="block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-container"
                        >
                            <img src={current.url} alt={title} className="h-full w-full object-cover" />
                        </button>
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-outline">
                            <Icon name="image" className="text-[40px]" />
                            <span className="text-body-sm font-body-sm">Belum ada foto</span>
                        </div>
                    )}

                    {current && (
                        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-surface-container-lowest/90 px-2.5 py-1.5 text-[11px] font-label-md font-bold text-primary shadow-sm">
                            <Icon name="zoom-in" className="text-[13px]" />
                            Klik untuk perbesar
                        </span>
                    )}

                    {count > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => go(-1)}
                                aria-label="Foto sebelumnya"
                                className={`${arrowClass} left-3`}
                            >
                                <Icon name="chevron-left" className="text-[18px]" />
                            </button>
                            <button
                                type="button"
                                onClick={() => go(1)}
                                aria-label="Foto berikutnya"
                                className={`${arrowClass} right-3`}
                            >
                                <Icon name="chevron-right" className="text-[18px]" />
                            </button>
                            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-on-surface/70 px-2.5 py-1 text-[11px] font-label-md font-bold tabular-nums text-white">
                                {active + 1} / {count}
                            </span>
                        </>
                    )}
                </div>

                {count > 1 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                        {images.map((image, index) => (
                            <button
                                key={image.id}
                                type="button"
                                onClick={() => setActive(index)}
                                aria-label={`Foto ${index + 1}`}
                                aria-current={index === active}
                                className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                                    index === active
                                        ? 'border-primary-container'
                                        : 'border-transparent hover:border-outline-variant'
                                }`}
                            >
                                <img src={image.url} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {open && current && (
                <ImageLightbox
                    images={images}
                    index={active}
                    onIndexChange={setActive}
                    onClose={() => setOpen(false)}
                    title={title}
                />
            )}
        </>
    );
}
