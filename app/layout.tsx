import "./globals.css";
import Providers from "./providers";

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
