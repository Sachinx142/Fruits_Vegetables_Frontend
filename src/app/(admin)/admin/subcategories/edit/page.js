import React, { Suspense } from 'react'
import SubCategoryEdit from "./SubCategoryEdit"

const page = () => {
  return (
    <Suspense>
       <SubCategoryEdit />
    </Suspense>
  )
}

export default page
