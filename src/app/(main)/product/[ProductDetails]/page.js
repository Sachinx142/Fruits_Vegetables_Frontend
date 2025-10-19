import React from 'react'
import ProductDetails from './ProductDetails'
import api from '@/_utils/api';

export async function generateMetadata({ params }) {
    try {
        const productSlug = (await params).productDetails
        const res = await api.post(`/product/getProductBySlug`, { productSlug: productSlug });

        const data = res.data;


        return {
            title: data?.data?.title || 'Fruits-and-Vegetables - Product Details',
            keywords: data?.data?.keywords,
            description: data?.data?.description
        }
    } catch (err) {
        console.log(err);
    }
}

const page = () => {
    return (
        <>
            <ProductDetails />
        </>
    )
}

export default page