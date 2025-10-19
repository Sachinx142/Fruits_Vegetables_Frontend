import React, { Suspense } from 'react'
import Edit from './Edit'

const page = () => {
    return (
        <>
            <Suspense>
                <Edit />
            </Suspense>
        </>
    )
}

export default page