import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/Components/UI/Icon';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const RESET = { scale: 1, x: 0, y: 0 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Tampilan layar penuh untuk foto produk.
 * - Zoom: tombol +/-, roda mouse, klik foto (1x <-> 2,5x), atau tombol keyboard + - 0
 * - Geser foto saat diperbesar: seret dengan mouse
 * - Ganti foto: panah kiri/kanan di layar atau keyboard
 * - Tutup: tombol X, klik area gelap, atau Esc
 */
export default function ImageLightbox({ images, index, onIndexChange, onClose, title }) {
    const [view, setView] = useState(RESET);
    const [dragging, setDragging] = useState(false);
    const stageRef = useRef(null);
    const imageRef = useRef(null);
    const drag = useRef(null);

    const current = images[index];
    const hasMany = images.length > 1;

    // Batasi geseran supaya foto tidak keluar dari layar.
    const limitOffset = useCallback((offset, scale) => {
        const stage = stageRef.current;
        const image = imageRef.current;
        if (!stage || !image) return offset;

        const maxX = Math.max(0, (image.offsetWidth * scale - stage.clientWidth) / 2);
        const maxY = Math.max(0, (image.offsetHeight * scale - stage.clientHeight) / 2);

        return { x: clamp(offset.x, -maxX, maxX), y: clamp(offset.y, -maxY, maxY) };
    }, []);

    const zoomBy = useCallback(
        (factor) =>
            setView((previous) => {
                const scale = clamp(previous.scale * factor, MIN_SCALE, MAX_SCALE);
                return scale === MIN_SCALE
                    ? RESET
                    : { scale, ...limitOffset({ x: previous.x, y: previous.y }, scale) };
            }),
        [limitOffset],
    );

    const resetView = useCallback(() => setView(RESET), []);

    const toggleZoom = () => setView((previous) => (previous.scale > 1 ? RESET : { scale: 2.5, x: 0, y: 0 }));

    const go = useCallback(
        (delta) => onIndexChange((index + delta + images.length) % images.length),
        [index, images.length, onIndexChange],
    );

    // Foto berganti -> kembali ke ukuran awal.
    useEffect(() => {
        resetView();
    }, [index, resetView]);

    // Kunci scroll halaman selama lightbox terbuka.
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
            else if (event.key === 'ArrowLeft' && hasMany) go(-1);
            else if (event.key === 'ArrowRight' && hasMany) go(1);
            else if (event.key === '+' || event.key === '=') zoomBy(1.25);
            else if (event.key === '-') zoomBy(1 / 1.25);
            else if (event.key === '0') resetView();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [go, hasMany, onClose, resetView, zoomBy]);

    const onPointerDown = (event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { startX: event.clientX, startY: event.clientY, originX: view.x, originY: view.y, moved: false };
        setDragging(true);
    };

    const onPointerMove = (event) => {
        const state = drag.current;
        if (!state) return;

        const dx = event.clientX - state.startX;
        const dy = event.clientY - state.startY;
        if (Math.abs(dx) + Math.abs(dy) > 4) state.moved = true;

        if (view.scale > 1) {
            setView((previous) => ({
                ...previous,
                ...limitOffset({ x: state.originX + dx, y: state.originY + dy }, previous.scale),
            }));
        }
    };

    const onPointerUp = () => {
        const state = drag.current;
        drag.current = null;
        setDragging(false);
        // Klik tanpa menyeret = zoom in/out.
        if (state && !state.moved) toggleZoom();
    };

    const controlClass =
        'pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40 disabled:hover:bg-white/10';

    return createPortal(
        <div role="dialog" aria-modal="true" aria-label={`Foto ${title}`} className="fixed inset-0 z-[70] bg-black/90">
            <div
                ref={stageRef}
                className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 pb-24 pt-16"
                onClick={(event) => {
                    if (event.target === event.currentTarget) onClose();
                }}
                onWheel={(event) => zoomBy(event.deltaY < 0 ? 1.15 : 1 / 1.15)}
            >
                <img
                    ref={imageRef}
                    src={current.url}
                    alt={title}
                    draggable={false}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    style={{
                        transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                        transition: dragging ? 'none' : 'transform 150ms ease-out',
                        cursor: view.scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
                        touchAction: 'none',
                    }}
                    className="max-h-full max-w-full select-none object-contain"
                />
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 text-white">
                <p className="min-w-0 truncate text-body-md font-body-md">
                    <span className="font-bold">
                        {index + 1} / {images.length}
                    </span>
                    <span className="ml-3 hidden text-white/70 sm:inline">{title}</span>
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => zoomBy(1 / 1.25)}
                        disabled={view.scale <= MIN_SCALE}
                        aria-label="Perkecil"
                        className={controlClass}
                    >
                        <Icon name="zoom-out" className="text-[18px]" />
                    </button>
                    <span className="pointer-events-none w-12 text-center text-label-md font-label-md font-bold tabular-nums">
                        {Math.round(view.scale * 100)}%
                    </span>
                    <button
                        type="button"
                        onClick={() => zoomBy(1.25)}
                        disabled={view.scale >= MAX_SCALE}
                        aria-label="Perbesar"
                        className={controlClass}
                    >
                        <Icon name="zoom-in" className="text-[18px]" />
                    </button>
                    <button
                        type="button"
                        onClick={resetView}
                        disabled={view.scale === MIN_SCALE}
                        aria-label="Kembalikan ukuran"
                        className={controlClass}
                    >
                        <Icon name="arrow-counterclockwise" className="text-[16px]" />
                    </button>
                    <button type="button" onClick={onClose} aria-label="Tutup" autoFocus className={`${controlClass} ml-2`}>
                        <Icon name="x-lg" className="text-[16px]" />
                    </button>
                </div>
            </div>

            {hasMany && (
                <>
                    <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label="Foto sebelumnya"
                        className={`${controlClass} absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2`}
                    >
                        <Icon name="chevron-left" className="text-[20px]" />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label="Foto berikutnya"
                        className={`${controlClass} absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2`}
                    >
                        <Icon name="chevron-right" className="text-[20px]" />
                    </button>

                    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-2 px-4">
                        {images.map((image, position) => (
                            <button
                                key={image.id}
                                type="button"
                                onClick={() => onIndexChange(position)}
                                aria-label={`Foto ${position + 1}`}
                                aria-current={position === index}
                                className={`pointer-events-auto h-14 w-14 overflow-hidden rounded-lg border-2 transition-opacity ${
                                    position === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={image.url} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>,
        document.body,
    );
}
