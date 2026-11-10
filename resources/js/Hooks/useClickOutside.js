import { useEffect } from 'react';

/** Panggil `handler` saat user mengklik di luar elemen `ref`. */
export default function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        };

        document.addEventListener('mousedown', listener);
        return () => document.removeEventListener('mousedown', listener);
    }, [ref, handler]);
}
