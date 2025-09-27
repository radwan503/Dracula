import type { Metadata } from "next";
import "./globals.css";
import '@/styles/index.scss'
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata: Metadata  = {
  title: "Dracula – Gaming Storefront",
  description: "Buy and pre-order the latest PC, Xbox, PlayStation, and Switch games. Dracula Storefront offers cinematic UI with red & black theme.",
  keywords: ["gaming storefront", "next.js game shop", "dracula theme", "PC games", "Xbox", "PS5"],
  openGraph: {
    title: "Dracula Gaming Storefront",
    description: "Arena-grade UI for your game store. Shop, pre-order, and checkout easily.",
    url: "https://yourdomain.com",
    images: ["/elements/shop/banner-soldier.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourhandle",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  )
}
