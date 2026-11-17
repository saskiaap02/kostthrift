import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Icon from '@/Components/UI/Icon';
import FormField, { inputClass } from '@/Components/UI/FormField';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout
            title="Lupa Password"
            subtitle="Masukkan alamat email yang terdaftar untuk menerima tautan pengaturan ulang password."
        >
            <Head title="Lupa Password" />

            {status && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-body-md font-body-md font-semibold text-emerald-700">
                    <Icon name="check-circle-fill" className="mt-0.5 text-[15px]" />
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <FormField label="Email" htmlFor="email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        autoComplete="username"
                        autoFocus
                        placeholder="nama@email.com"
                        className={inputClass}
                    />
                </FormField>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary active:scale-[0.99] disabled:opacity-60"
                >
                    {processing && <Icon name="arrow-repeat" className="animate-spin text-[14px]" />}
                    {processing ? 'Mengirim tautan...' : 'Kirim Tautan Reset Password'}
                </button>
            </form>

            <p className="mt-6 text-center text-body-md font-body-md text-on-surface-variant">
                Ingat password-mu?{' '}
                <Link href="/login" className="font-bold text-primary-container hover:underline">
                    Kembali ke halaman masuk
                </Link>
            </p>
        </GuestLayout>
    );
}