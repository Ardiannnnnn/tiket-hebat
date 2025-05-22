import PageLogin from "@/app/ui/login/login";
import { poppins } from "../ui/fonts";

export default function Login() {
  return (
    <div className={`${poppins.className} flex flex-col items-center justify-center h-screen mx-2 sm:mx-auto gap-8`}>
      <p className="text-2xl text-Blue font-semibold">Tiket <span className="text-Orange"> Hebat </span> </p>  
      <PageLogin />
    </div>
  );
}
