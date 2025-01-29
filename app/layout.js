import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
// import { AuthProvider } from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'File Share App',
  description: 'Secure file sharing platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
 <body className="dark:bg-gray-900 dark:text-white"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
