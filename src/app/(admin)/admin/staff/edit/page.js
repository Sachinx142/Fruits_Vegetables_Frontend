import React, { Suspense } from 'react'
import EditStaff from "./EditStaff"

const page = () => {
  return (
    <Suspense>
       <EditStaff />
    </Suspense>
  )
}

export default page
