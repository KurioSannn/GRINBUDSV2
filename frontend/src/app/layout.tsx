import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "GrinBuds — Belajar Membaca Menyenangkan!",
  description: "GrinBuds adalah platform gamifikasi edukatif yang membantu anak-anak belajar membaca dengan cara menyenangkan dan mendeteksi disleksia sejak dini.",
  keywords: ["belajar membaca", "disleksia", "edukasi anak", "gamifikasi", "GrinBuds"],
  authors: [{ name: "GrinBuds Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
