// app/ui/beranda/footer.tsx
import Link from "next/link";
import { mouseMemoirs } from "../fonts";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Ship,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-Orange text-white mt-8">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-Blue rounded-full flex items-center justify-center shadow-lg">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <h3 className={`${mouseMemoirs.className} text-3xl font-bold`}>
                TiketHebat
              </h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Platform terpercaya untuk pemesanan tiket kapal ferry di Aceh.
              Mudah, aman, dan terjangkau untuk perjalanan Anda.
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-Blue/30 rounded-full flex items-center justify-center hover:bg-Blue/50 transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-Blue/30 rounded-full flex items-center justify-center hover:bg-Blue/50 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-Blue/30 rounded-full flex items-center justify-center hover:bg-Blue/50 transition-colors cursor-pointer">
                <Instagram className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-Blue rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              Kontak Kami
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3">
                <MapPin className="w-5 h-5 text-Blue mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    7R96+QW2, Jl. Bahari, Pulo Sarok
                    <br />
                    Kec. Singkil, Kabupaten Aceh Singkil
                    <br />
                    Aceh 24472
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                <Mail className="w-5 h-5 text-Blue flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80">Email</p>
                  <a
                    href="mailto:Tikethebat@gmail.com"
                    className="text-white hover:text-Blue transition-colors font-medium"
                  >
                    Tikethebat@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-Blue rounded-full flex items-center justify-center">
                <Phone className="w-3 h-3 text-white" />
              </div>
              Customer Support
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                <Phone className="w-5 h-5 text-Blue flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80">Contact Support</p>
                  <p className="text-white font-medium">Ardian</p>
                  <a
                    href="tel:+6282227778899"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    0822-3783-4717
                  </a>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/6282227778899?text=Halo, saya butuh bantuan dengan TiketHebat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  Chat WhatsApp
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-Blue rounded-full flex items-center justify-center">
                <Ship className="w-3 h-3 text-white" />
              </div>
              Layanan
            </h4>

            <div className="space-y-2">
               <Link
                href="/"
                className="block text-white/80 hover:text-white hover:bg-Blue/20 transition-all duration-200 text-sm p-2 rounded"
              >
                Pesan Tiket
              </Link>
              <Link
                href="/jadwal"
                className="block text-white/80 hover:text-white hover:bg-Blue/20 transition-all duration-200 text-sm p-2 rounded"
              >
                Cek Jadwal
              </Link>
              <Link
                href="/tiket"
                className="block text-white/80 hover:text-white hover:bg-Blue/20 transition-all duration-200 text-sm p-2 rounded"
              >
                Status Tiket
              </Link>
              <Link
                href="/syarat"
                className="block text-white/80 hover:text-white hover:bg-Blue/20 transition-all duration-200 text-sm p-2 rounded"
              >
                Syarat & Ketentuan
              </Link>
              <Link
                href="/kebijakan"
                className="block text-white/80 hover:text-white hover:bg-Blue/20 transition-all duration-200 text-sm p-2 rounded"
              >
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Blue Section */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-white/90">
              <p>&copy; 2024 TiketHebat. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/80">Powered by</span>
              <div className="flex items-center gap-2 bg-Orange rounded-full px-3 py-1">
                <Ship className="w-4 h-4 text-white" />
                <span
                  className={`${mouseMemoirs.className} text-white font-semibold`}
                >
                  TiketHebat
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
