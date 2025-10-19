import React from 'react'
import BlogDetails from './BlogDetails'
import api from '@/_utils/api';

export async function generateMetadata({ params }) {
    try {
        const blogSlug = (await params).BlogDetails
        const res = await api.post(`/blogs/getBlogBySlug`, { blogSlug: blogSlug });

        const data = res.data;


        return {
            title: data?.data?.title || 'Fruits-and-Vegetables - BlogDetails Details',
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
            <BlogDetails />
        </>
    )
}

export default page