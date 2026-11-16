import { Head, Link, usePage } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import { INFO_LINKS } from '@/Lib/info';

/**
 * Kerangka halaman informasi.
 * sections = [{ heading, paragraphs?: string[], items?: string[] }]
 */
export default function InfoPage({ title, intro, updatedAt, notice, sections = [], children }) {
    const path = usePage().url.split('?')[0];

    return (
        <MarketLayout>
            <Head title={title} />

            <div className="mx-auto w-full max-w-3xl px-margin-mobile pb-6 pt-6 md:px-margin">
                <Link
                    href="/"
                    className="mb-4 inline-flex items-center gap-1.5 text-label-lg font-label-lg font-bold text-primary-container hover:underline"
                >
                    <Icon name="arrow-left" className="text-[13px]" />
                    Kembali ke Beranda
                </Link>

                <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                    {title}
                </h1>
                {intro && <p className="mt-2 text-body-lg font-body-lg text-on-surface-variant">{intro}</p>}
                {updatedAt && (
                    <p className="mt-2 text-body-sm font-body-sm text-outline">Terakhir diperbarui: {updatedAt}</p>
                )}

                {notice && (
                    <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-body-md font-body-md text-orange-900">
                        <Icon name="exclamation-triangle-fill" className="mt-0.5 text-[15px]" />
                        <span>{notice}</span>
                    </p>
                )}

                <div className="mt-6 space-y-7">
                    {sections.map((section) => (
                        <section key={section.heading}>
                            <h2 className="mb-2 font-headline-md text-headline-sm font-bold text-on-surface">
                                {section.heading}
                            </h2>
                            {section.paragraphs?.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="mb-2 text-body-md font-body-md leading-relaxed text-on-surface-variant"
                                >
                                    {paragraph}
                                </p>
                            ))}
                            {section.items && (
                                <ul className="list-disc space-y-1.5 pl-5 text-body-md font-body-md leading-relaxed text-on-surface-variant">
                                    {section.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                    {children}
                </div>

                <nav aria-label="Halaman informasi lain" className="mt-10 border-t border-outline-variant/30 pt-5">
                    <p className="mb-2 text-label-lg font-label-lg font-bold text-on-surface">Halaman lain</p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                        {INFO_LINKS.filter((link) => link.href !== path).map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-body-md font-body-md font-bold text-primary-container hover:underline">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </MarketLayout>
    );
}
