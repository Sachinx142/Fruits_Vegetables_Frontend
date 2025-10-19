"use client"
import Link from 'next/link'
import React from 'react'
import {
  BsCart3,
  BsGrid1X2Fill,
  BsBoxSeam,
  BsFillGrid3X3GapFill,
  BsClipboardData,
  BsPeopleFill,
  BsChatQuoteFill,
  BsFileEarmarkText,
  BsPersonGear,
  BsGearFill,
  BsBoxArrowRight
} from 'react-icons/bs'

const AdminSidebar = ({ openSidebarToggle, OpenSidebar }) => {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> Veggies
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>☰</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link href="/admin">
            <BsGrid1X2Fill className='icon' /> Dashboard
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/products">
            <BsBoxSeam className='icon' /> Products
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/categories">
            <BsFillGrid3X3GapFill className='icon' /> Categories
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/subcategories">
            <div className='d-flex align-items-center '> 
                <BsFillGrid3X3GapFill className='icon' /> Subcategories
            </div>
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/orders">  
            <BsClipboardData className='icon' /> Orders
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/customers">
            <BsPeopleFill className='icon' /> Customers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/role">
            <BsPeopleFill className='icon' /> Roles
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/testimonials">
            <BsChatQuoteFill className='icon' /> Testimonials
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/blogs">
            <BsFileEarmarkText className='icon' /> Blog Posts
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link href="/admin/staff">
            <BsPersonGear className='icon' /> Staff
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default AdminSidebar
