import React, { Suspense } from 'react'
import CustomerEdit from "./CustomerEdit"

const page = () => {
  return (
    <Suspense>
       <CustomerEdit />
    </Suspense>
  )
}

export default page
