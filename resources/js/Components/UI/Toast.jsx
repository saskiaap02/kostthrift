import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

/** Pesan singkat di pojok layar: flash `success` dari server atau error `product_id`. */
export default function Toast() {
    const { flash, errors } = usePage().props;
    const success = flash?.success ?? null;
    const error = errors?.product_id ?? null;
    const message = success ?? error;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!message) return undefined;

        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, [flash, errors, message]);

    if (!message || !visible) return null;

    return (
        <div
            role="status"
            className={`fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-label-lg font-label-lg font-bold text-white shadow-lg ${
                success ? 'bg-emerald-600' : 'bg-error'
            }`}
        >
            <Icon name={success ? 'check-circle-fill' : 'exclamation-circle-fill'} className="text-[16px]" />
            <span>{message}</span>
        </div>
    );
}
