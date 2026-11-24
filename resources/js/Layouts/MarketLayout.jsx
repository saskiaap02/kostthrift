import Navbar from '@/Components/Layout/Navbar';
import Footer from '@/Components/Layout/Footer';
import VerifyEmailBanner from '@/Components/Layout/VerifyEmailBanner';
import Toast from '@/Components/UI/Toast';

/**
 * Layout halaman publik KosThrift (navbar atas + footer).
 * Menggantikan bottom-nav mobile dari desain Stitch.
 */
export default function MarketLayout({ children }) {
    return (
        <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
            <Navbar />
            <VerifyEmailBanner />
            <main>{children}</main>
            <Footer />
            <Toast />
        </div>
    );
}
