"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "bootstrap-icons/font/bootstrap-icons.css"
import UserProvider from "@/_context/UserContext";
import Script from "next/script";
import Header from "@/component/Header"
import Footer from "@/component/Footer"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link href="/img/favicon.ico" rel="icon" />

        <link rel="preconnect" href="https://fonts.googleapis.com/" />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="true" />

        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&amp;display=swap" rel="stylesheet" />


        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&amp;display=swap"
          rel="stylesheet" />

        {/* Bootstrap */}
        <link href="/css/bootstrap.min.css" rel="stylesheet" />

        {/* Template Stylesheet */}
        <link href="/css/style.css" rel="stylesheet" />
        <link href="/css/assets/css/blog.css" rel="stylesheet" />
        <link href="/css/assets/css/login.css" rel="stylesheet" />
        <link href="/css/assets/css/register.css" rel="stylesheet" />
        <link href="/css/assets/css/user.css" rel="stylesheet" />
      </head>
      <body>
        {/* Spinner Start */}

        {/* Spinner End */}

        <SessionProvider>
          <UserProvider>
            <Header/>
            {children}
            <Footer/>
            </UserProvider>
        </SessionProvider>

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              border: "1px solid #010745",
              padding: "16px",
              color: "#010745",
            },
            iconTheme: {
              primary: "#010745",
              secondary: "#F1F0FB",
            },
          }}
        />

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
