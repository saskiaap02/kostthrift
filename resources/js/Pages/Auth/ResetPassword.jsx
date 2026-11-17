import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Icon from '@/Components/UI/Icon';
import FormField, { inputClass } from '@/Components/UI/FormField';
import PasswordInput from '@/Components/UI/PasswordInput';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Buat Password Baru"
            subtitle="Masukkan password baru yang kuat untuk mengamankan akun KosThrift-mu."
        >
            <Head title="Reset Password" />

            <form onSubmit={submit} className="space-y-4">
                <FormField label="Email" htmlFor="email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        autoComplete="username"
                        className={inputClass}
                    />
                </FormField>

                <FormField label="Password baru" htmlFor="password" error={errors.password}>
                    <PasswordInput
                        id="password"
                        value={data.password}
                        onChange={(value) => setData('password', value)}
                        autoComplete="new-password"
                        autoFocus
                        invalid={Boolean(errors.password)}
                    />
                </FormField>

                <FormField label="Konfirmasi password baru" htmlFor="password_confirmation" error={errors.password_confirmation}>
                    <PasswordInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(value) => setData('password_confirmation', value)}
                        autoComplete="new-password"
                        invalid={Boolean(errors.password_confirmation)}
                    />
                </FormField>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary active:scale-[0.99] disabled:opacity-60"
                >
                    {processing && <Icon name="arrow-repeat" className="animate-spin text-[14px]" />}
                    {processing ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
            </form>
        </GuestLayout>
    );
}