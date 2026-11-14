import { Head } from '@inertiajs/react';
import MarketLayout from '@/Layouts/MarketLayout';
import ProductForm from '@/Components/Product/ProductForm';

/** Props dari ProductController@create: categories, campuses, default_campus_id */
export default function Create({ categories, campuses, default_campus_id }) {
    return (
        <MarketLayout>
            <Head title="Jual Barang" />

            <div className="mx-auto w-full max-w-3xl px-margin-mobile pb-6 pt-6 md:px-margin">
                <div className="mb-5">
                    <h1 className="font-headline-lg text-headline-md font-extrabold text-on-surface md:text-headline-lg">
                        Jual Barang
                    </h1>
                    <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                        Pasang iklan perlengkapan kos-mu. Foto yang jelas dan deskripsi jujur membuat barang lebih cepat
                        terjual.
                    </p>
                </div>

                <ProductForm categories={categories} campuses={campuses} defaultCampusId={default_campus_id} />
            </div>
        </MarketLayout>
    );
}
