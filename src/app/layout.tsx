"use client"
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "react-redux";
import { store , persistor} from "@/redux/store";
import {  PersistGate } from 'redux-persist/integration/react'


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster />
        </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
