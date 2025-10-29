import React, { Suspense } from 'react'
import OrderViewPage from "./OrderViewPage"

const page = () => {
  return (
    <Suspense>
       <OrderViewPage />
    </Suspense>
  )
}

export default page
