import { Head, Link } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import Icon from '@/Components/UI/Icon';
import ProductForm from '@/Components/Product/ProductForm';

/** Props dari ProductController@edit: product (ProductFormResource), categories, campuses */
export default function Edit({ product, categories, campuses }) {
    return (
        <MarketLayout>
            <Head title="Edit Iklan" />

            <div className="mx-auto w-full max-w-3xl px-margin-mobile pb-6 pt-6 md:px-margin">
                <Link
                    href="/iklan-saya"
                    className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-3.5 py-1.5 text-label-lg font-label-lg font-bold text-primary-container transition-colors hover:bg-surface-container-low"
                >
                    <Icon name="arrow-left" className="text-[13px]" />
                    Kembali ke Iklan Saya
                </Link>

                <div className="mb-5">
                    <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                        Edit Iklan
                    </h1>
                    <p className="mt-1 truncate text-body-md font-body-md text-on-surface-variant">{product.title}</p>
                </div>

                <ProductForm product={product} categories={categories} campuses={campuses} />
            </div>
        </MarketLayout>
    );
}
