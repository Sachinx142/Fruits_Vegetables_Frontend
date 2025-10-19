'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/component/admin/AdminHeader'
import Sidebar from '@/component/admin/AdminSidebar'
import PermissionProvider from '@/_context/PermissionContext'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => setOpenSidebarToggle(!openSidebarToggle)

  // ✅ Skip layout for login page
  if (pathname === '/admin/admin-login') {
    return <>{children}</>
  }

  return (
    <>
      <html lang='en'>
        <head>
          <link href="/css/bootstrap.min.css" rel="stylesheet" />

          {/* Icon Fonts */}
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
            rel="stylesheet"
          />


          <link href="/css/assets/css/admin/admin.css" rel="stylesheet" />
          <link href="/css/assets/css/admin/adminHeader.css" rel="stylesheet" />
          <link href="/css/assets/css/admin/adminSidebar.css" rel="stylesheet" />
        </head>

        <body>
          <PermissionProvider>
            <div className="grid-container">
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <main className="main-content">{children}</main>
            </div>
          </PermissionProvider>
        </body>
      </html>
    </>
  )
}
