'use client'
import React, { useState } from 'react'
import Header from '@/component/admin/Header'
import Sidebar from '@/component/admin/Sidebar'
import { ToastContainer } from "react-toastify";
import PermissionProvider from '@/_context/PermissionContext'

export default function AdminLayout({ children }) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => setOpenSidebarToggle(!openSidebarToggle)


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
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </body>
      </html>
    </>
  )
}
