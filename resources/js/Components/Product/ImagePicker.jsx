import { useEffect, useMemo, useRef } from 'react';
import Icon from '@/Components/UI/Icon';

/**
 * Pilih beberapa foto (klik atau seret), pratinjau, hapus, dan pilih foto utama.
 * Foto pertama = foto utama. `files` = array File, dipegang parent (useForm).
 */
export default function ImagePicker({ files, onChange, max = 5, error }) {
    const inputRef = useRef(null);

    const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
    useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

    const add = (list) => {
        const images = Array.from(list).filter((file) => file.type.startsWith('image/'));
        onChange([...files, ...images].slice(0, max));
    };

    const remove = (index) => onChange(files.filter((_, i) => i !== index));

    const makePrimary = (index) => onChange([files[index], ...files.filter((_, i) => i !== index)]);

    const canAdd = files.length < max;

    return (
        <div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {previews.map((url, index) => (
                    <div
                        key={url}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-low"
                    >
                        <img src={url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />

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

                {canAdd && (
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
                {files.length}/{max} foto. Format JPG, PNG, atau WEBP, maksimal 2 MB per foto.
            </p>
            {error && (
                <p role="alert" className="mt-1 text-body-sm font-body-sm font-semibold text-error">
                    {error}
                </p>
            )}
        </div>
    );
}
