import { Mouse_Memoirs } from 'next/font/google';
import { Montserrat } from 'next/font/google';
import { Poppins } from "next/font/google";

export const mouseMemoirs = Mouse_Memoirs({ 
    weight: ['400'],
    subsets: ['latin']
});

export const montserrat = Montserrat({
    weight: ['400', '500', '600'],
    subsets: ['latin']
});

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"], // Sesuaikan dengan kebutuhan
  })