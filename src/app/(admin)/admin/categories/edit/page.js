import React, { Suspense } from 'react'
import CategoryEdit from "./CategoryEdit"

const page = () => {
  return (
    <Suspense>
       <CategoryEdit />
    </Suspense>
  )
}

export default page
