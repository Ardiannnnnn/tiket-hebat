import "./globals.css";
export const metadata = {
  title: "Tiket Hebat",
  icons: {
    icon: "/KMP-Aceh-Hebat-1.jpg", // atau .png, .svg sesuai file kamu
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
