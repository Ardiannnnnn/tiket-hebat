import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Tiket Hebat",
  description: "Platform tiket online terbaik",
  icons: {
    icon: [
      { url: '/ship.svg', type: 'image/svg+xml' }, // pakai svg
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="icon" type="image/svg+xml" href="/ship.svg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
