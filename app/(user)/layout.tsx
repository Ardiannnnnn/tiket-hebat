import Navbar from "../ui/beranda/navbar";
import Footer from "../ui/beranda/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center">
        {children}
      </div>
      <Footer />
    </>
  );
}
