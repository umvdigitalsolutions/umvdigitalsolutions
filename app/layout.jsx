import { Geist, Geist_Mono } from "next/font/google";
import Preloader from "./components/Preloader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://umvdigitalsolutions.com"),
  title: "UMV Digital Solutions | Website Development & Digital Marketing Agency",
  description:
    "UMV Digital Solutions provides website development, software development, SEO, branding, graphic design, content shoots and digital marketing services.",
  openGraph: {
    title: "UMV Digital Solutions | Website Development & Digital Marketing Agency",
    description:
      "Websites, software, SEO, branding, graphic design, content shoots and digital marketing solutions designed to make your brand stand out.",
    url: "https://umvdigitalsolutions.com",
    siteName: "UMV Digital Solutions",
    type: "website",
  },
  keywords: [
    "UMV Digital Solutions",
    "website development",
    "digital marketing agency",
    "SEO services",
    "software development",
    "branding",
    "graphic design",
    "content shoots",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
