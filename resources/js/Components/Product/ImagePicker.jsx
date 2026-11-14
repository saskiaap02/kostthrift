import { useEffect, useRef } from 'react';
import Icon from '@/Components/UI/Icon';

let counter = 0;
const nextKey = () => `new-${Date.now()}-${counter++}`;

/**
 * Pilih dan atur foto (klik atau seret). Dipakai form Jual dan form Edit.
 *
 * `items` = daftar foto sesuai urutan tampil, foto pertama = foto utama:
 *   - foto lama (Edit):  { key, id, url }
 *   - foto baru:         { key, file, url }   (url = pratinjau lokal)
 * Parent memegang `items` dan menerima daftar baru lewat `onChange`.
 */
export default function ImagePicker({ items, onChange, max = 5, error }) {
    const inputRef = useRef(null);
    const itemsRef = useRef(items);
    itemsRef.current = items;

    // Lepaskan URL pratinjau lokal saat komponen ditutup.
    useEffect(
        () => () => itemsRef.current.forEach((item) => item.file && URL.revokeObjectURL(item.url)),
        [],
    );

    const add = (list) => {
        const room = Math.max(0, max - items.length);
        const added = Array.from(list)
            .filter((file) => file.type.startsWith('image/'))
            .slice(0, room)
            .map((file) => ({ key: nextKey(), file, url: URL.createObjectURL(file) }));

        if (added.length > 0) onChange([...items, ...added]);
    };

    const remove = (index) => {
        const item = items[index];
        if (item.file) URL.revokeObjectURL(item.url);
        onChange(items.filter((_, i) => i !== index));
    };

    const makePrimary = (index) => onChange([items[index], ...items.filter((_, i) => i !== index)]);

    return (
        <div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {items.map((item, index) => (
                    <div
                        key={item.key}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-low"
                    >
                        <img src={item.url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />

                        {index === 0 ? (
                            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-label-sm font-bold text-white">
                                Utama
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => makePrimary(index)}
                                className="absolute bottom-1.5 left-1.5 rounded-full bg-surface-container-lowest/90 px-2 py-0.5 text-[10px] font-label-sm font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                            >
                                Jadikan utama
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => remove(index)}
                            aria-label={`Hapus foto ${index + 1}`}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-on-surface/70 text-white transition-colors hover:bg-error"
                        >
                            <Icon name="x-lg" className="text-[10px]" />
                        </button>
                    </div>
                ))}

                {items.length < max && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            add(event.dataTransfer.files);
                        }}
                        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary-container"
                    >
                        <Icon name="camera" className="text-[22px]" />
                        <span className="text-[11px] font-label-md font-bold">Tambah foto</span>
                    </button>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                tabIndex={-1}
                onChange={(event) => {
                    add(event.target.files);
                    event.target.value = '';
                }}
            />

            <p className="mt-2 text-body-sm font-body-sm text-on-surface-variant">
                {items.length}/{max} foto. Format JPG, PNG, atau WEBP, maksimal 2 MB per foto. Foto pertama jadi foto
                utama.
            </p>
            {error && (
                <p role="alert" className="mt-1 text-body-sm font-body-sm font-semibold text-error">
                    {error}
                </p>
            )}
        </div>
    );
}
