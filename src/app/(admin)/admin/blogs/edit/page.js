import React, { Suspense } from 'react'
import BlogEdit from "./BlogEdit"

const page = () => {
  return (
    <Suspense>
       <BlogEdit />
    </Suspense>
  )
}

export default page
