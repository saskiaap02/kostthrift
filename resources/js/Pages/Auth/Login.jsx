import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Icon from '@/Components/UI/Icon';
import FormField, { inputClass } from '@/Components/UI/FormField';
import PasswordInput from '@/Components/UI/PasswordInput';

/** Props dari AuthenticatedSessionController@create (bawaan Breeze): status, canResetPassword */
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout title="Masuk ke KosThrift" subtitle="Lanjutkan jual beli perlengkapan kos dengan aman.">
            <Head title="Masuk" />

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

                <FormField label="Password" htmlFor="password" error={errors.password}>
                    <PasswordInput
                        id="password"
                        value={data.password}
                        onChange={(value) => setData('password', value)}
                        autoComplete="current-password"
                        invalid={Boolean(errors.password)}
                    />
                </FormField>

                <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-body-md font-body-md text-on-surface-variant">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(event) => setData('remember', event.target.checked)}
                            className="h-4 w-4 rounded border-outline text-primary-container focus:ring-primary-container"
                        />
                        Ingat saya
                    </label>
                    {canResetPassword && (
                        <Link
                            href="/forgot-password"
                            className="text-body-md font-body-md font-bold text-primary-container hover:underline"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary active:scale-[0.99] disabled:opacity-60"
                >
                    {processing && <Icon name="arrow-repeat" className="animate-spin text-[14px]" />}
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>
            </form>

            <p className="mt-6 text-center text-body-md font-body-md text-on-surface-variant">
                Belum punya akun?{' '}
                <Link href="/register" className="font-bold text-primary-container hover:underline">
                    Daftar sekarang
                </Link>
            </p>
        </GuestLayout>
    );
}
