import { useState } from 'react';
import Icon from '@/Components/UI/Icon';
import { inputClass } from '@/Components/UI/FormField';

/** Input password dengan tombol tampilkan/sembunyikan. */
export default function PasswordInput({ id, value, onChange, autoComplete, placeholder, invalid }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                id={id}
                type={visible ? 'text' : 'password'}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                autoComplete={autoComplete}
                placeholder={placeholder}
                aria-invalid={invalid}
                className={`${inputClass} pr-11`}
            />
            <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-outline transition-colors hover:text-primary-container"
            >
                <Icon name={visible ? 'eye-slash' : 'eye'} className="text-[16px]" />
            </button>
        </div>
    );
}
