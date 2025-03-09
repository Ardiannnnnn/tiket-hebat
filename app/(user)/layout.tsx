import Navbar from "../ui/beranda/navbar";
import Footer from "../ui/beranda/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 mt-2">{children}</div>
      <Footer />
    </div>
  );
}
