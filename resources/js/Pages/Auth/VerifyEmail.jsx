import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Icon from '@/Components/UI/Icon';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (event) => {
        event.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <GuestLayout
            title="Verifikasi Alamat Email"
            subtitle="Terima kasih telah mendaftar! Silakan klik tautan verifikasi yang baru saja kami kirim ke emailmu."
        >
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-body-md font-body-md font-semibold text-emerald-700">
                    <Icon name="check-circle-fill" className="mt-0.5 text-[15px]" />
                    <span>Tautan verifikasi baru telah dikirim ke alamat email yang kamu daftarkan.</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-label-lg font-bold text-white transition-colors hover:bg-tertiary active:scale-[0.99] disabled:opacity-60"
                >
                    {processing && <Icon name="arrow-repeat" className="animate-spin text-[14px]" />}
                    {processing ? 'Mengirim ulang...' : 'Kirim Ulang Email Verifikasi'}
                </button>

                <div className="text-center">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-body-md font-body-md font-bold text-on-surface-variant hover:text-error hover:underline"
                    >
                        Keluar dari akun
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}