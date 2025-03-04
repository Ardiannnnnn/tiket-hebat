import Image from "next/image";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";


export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto h-screen items-center flex justify-center">
        hello
      </div>
      <Footer />
    </>
  );
}
