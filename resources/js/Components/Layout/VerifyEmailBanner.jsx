import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

/** Pengingat untuk akun yang emailnya belum diverifikasi (admin tidak perlu). */
export default function VerifyEmailBanner() {
    const user = usePage().props.auth?.user;

    if (!user || user.role === 'admin' || user.email_verified_at) return null;

    return (
        <div role="status" className="bg-amber-50 px-4 py-2.5 text-center text-body-sm font-body-sm text-amber-900">
            <Icon name="envelope-exclamation" className="mr-1.5 text-[14px]" />
            Verifikasi emailmu untuk memasang iklan dan memesan barang.{' '}
            <Link href="/verify-email" className="font-bold underline">
                Kirim tautan verifikasi
            </Link>
        </div>
    );
}
