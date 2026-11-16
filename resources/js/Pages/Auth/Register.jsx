import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Icon from '@/Components/UI/Icon';
import FormField, { inputClass } from '@/Components/UI/FormField';
import PasswordInput from '@/Components/UI/PasswordInput';
import CampusSelect from '@/Components/UI/CampusSelect';

/** Props dari RegisteredUserController@create: campuses [{ id, name, city, university: { slug, name } }] */
export default function Register({ campuses }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        campus_id: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/register', { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestLayout title="Buat akun KosThrift" subtitle="Gratis. Mulai jual beli perlengkapan kos dalam semenit.">
            <Head title="Daftar" />

            <form onSubmit={submit} className="space-y-4">
                <FormField label="Nama lengkap" htmlFor="name" required error={errors.name}>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        autoComplete="name"
                        autoFocus
                        placeholder="Nama sesuai KTM"
                        className={inputClass}
                    />
                </FormField>

                <FormField label="Email" htmlFor="email" required error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        autoComplete="username"
                        placeholder="nama@email.com"
                        className={inputClass}
                    />
                </FormField>

                <div className="rounded-2xl bg-surface-container-low/70 p-4">
                    <p className="mb-3 flex items-center gap-2 text-label-lg font-label-lg font-bold text-on-surface">
                        <Icon name="geo-alt" className="text-[15px] text-primary-container" />
                        Kampus kamu <span className="font-normal text-on-surface-variant">(opsional)</span>
                    </p>
                    <CampusSelect
                        campuses={campuses}
                        value={data.campus_id}
                        onChange={(id) => setData('campus_id', id)}
                        error={errors.campus_id}
                    />
                    <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant">
                        Dipakai sebagai pilihan awal lokasi saat kamu memasang iklan.
                    </p>
                </div>

                <FormField
                    label="Password"
                    htmlFor="password"
                    required
                    error={errors.password}
                    hint="Minimal 8 karakter."
                >
                    <PasswordInput
                        id="password"
                        value={data.password}
                        onChange={(value) => setData('password', value)}
                        autoComplete="new-password"
                        invalid={Boolean(errors.password)}
                    />
                </FormField>

                <FormField
                    label="Ulangi password"
                    htmlFor="password_confirmation"
                    required
                    error={errors.password_confirmation}
                >
                    <PasswordInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(value) => setData('password_confirmation', value)}
                        autoComplete="new-password"
                        invalid={Boolean(errors.password_confirmation)}
                    />
                </FormField>

                <p className="text-center text-body-sm font-body-sm text-on-surface-variant">
                    Dengan mendaftar, kamu menyetujui{' '}
                    <Link href="/syarat-ketentuan" className="font-bold text-primary-container hover:underline">
                        Syarat &amp; Ketentuan
                    </Link>{' '}
                    dan{' '}
                    <Link href="/kebijakan-privasi" className="font-bold text-primary-container hover:underline">
                        Kebijakan Privasi
                    </Link>
                    .
                </p>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary active:scale-[0.99] disabled:opacity-60"
                >
                    {processing && <Icon name="arrow-repeat" className="animate-spin text-[14px]" />}
                    {processing ? 'Mendaftarkan...' : 'Daftar'}
                </button>
            </form>

            <p className="mt-6 text-center text-body-md font-body-md text-on-surface-variant">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-bold text-primary-container hover:underline">
                    Masuk
                </Link>
            </p>
        </GuestLayout>
    );
}
