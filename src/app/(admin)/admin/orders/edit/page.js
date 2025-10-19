import React, { Suspense } from 'react'
import OrdersEdit from "./OrdersEdit"

const page = () => {
  return (
    <Suspense>
       <OrdersEdit />
    </Suspense>
  )
}

export default page
