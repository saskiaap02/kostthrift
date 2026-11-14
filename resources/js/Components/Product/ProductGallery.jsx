import { useState } from 'react';
import Icon from '@/Components/UI/Icon';

/** Foto utama besar + deretan thumbnail. `images` = [{ id, url }]. */
export default function ProductGallery({ images = [], title }) {
    const [active, setActive] = useState(0);
    const current = images[active];

    return (
        <div>
            <div className="aspect-square w-full overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low">
                {current ? (
                    <img src={current.url} alt={title} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-outline">
                        <Icon name="image" className="text-[40px]" />
                        <span className="text-body-sm font-body-sm">Belum ada foto</span>
                    </div>
                )}
            </div>

            {images.length > 1 && (
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
    );
}
