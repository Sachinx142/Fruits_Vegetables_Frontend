'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/component/admin/AdminHeader'
import Sidebar from '@/component/admin/AdminSidebar'
import PermissionProvider from '@/_context/PermissionContext'

export default function LoginLayout({ children }) {
  const pathname = usePathname()
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  // ✅ If path is admin-login, render only children
  if (pathname === '/admin/admin-login') {
    return <>{children}</>
  }

  return (

    <html lang='en'>

      <head>
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/assets/css/admin/admin.css" rel="stylesheet" />
        <link href="/css/assets/css/admin/adminHeader.css" rel="stylesheet" />
        <link href="/css/assets/css/admin/adminSidebar.css" rel="stylesheet" />
      </head>

      <body>

        <PermissionProvider>
          <div className='grid-container'>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <main className="main-content">
              {children}
            </main>
          </div>
        </PermissionProvider>

      </body>
    </html>
  )
}
