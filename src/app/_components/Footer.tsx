// components/Footer.tsx
import React from "react";

const Footer = () => {
  return (
    <footer className="text-white">
      {/* ================= HEADER PUTIH (FULL WIDTH) ================= */}
      <div className="bg-white w-full">
        <div
          className="mx-auto max-w-[1180px] grid grid-cols-[96px_1fr_96px] items-center gap-4 sm:gap-8 px-6 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16"
        >
          {/* KOL 1: label kecil */}
          <div className="text-[10px] tracking-[0.18em] text-neutral-500 font-semibold leading-4">
            HEARD<br />ENOUGH? →
          </div>

          {/* KOL 2: judul + underline */}
          <div className="min-w-0">
            <h2 className="text-[40px] sm:text-[56px] lg:text-[80px] font-semibold leading-[0.95] text-neutral-900">
              Contact us
            </h2>
            <span className="block mt-3 h-[6px] w-40 sm:w-48 bg-[#e7ff38]" />
          </div>

          {/* KOL 3: tombol bulat kanan */}
          <div className="flex justify-end">
            <a
              href="#contact"
              aria-label="Go to contact"
              className="
                group
                w-12 h-12 sm:w-16 sm:h-16
                rounded-full bg-[#e7ff38] text-black
                flex items-center justify-center
                transition-transform duration-200
                hover:translate-x-1
              "
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ================ PANEL GELAP (FULL WIDTH) ================ */}
      <div className="bg-[#0c0f14] [background:linear-gradient(135deg,#0c0f14_0%,#0e1117_55%,#0a0c11_100%)] w-full">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 items-start text-left align-top">
            {/* Brand besar */}
            <div className="min-w-0">
              <h3 className="text-[26px] sm:text-[34px] font-bold leading-[1.03] tracking-tight text-left mb-8 lg:mb-0">
                The agency for impatient brands<span className="align-super text-base">®</span>
              </h3>
            </div>

            {/* Jakarta */}
            <div id="contact" className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/80 font-semibold mb-2">
                Jakarta
              </p>
              <div className="space-y-1 text-white/90 text-left">
                <p>
                  <a
                    href="mailto:hello@vibedaily.com"
                    className="underline underline-offset-[4px] decoration-white hover:text-white"
                  >
                    hello@vibedaily.com
                  </a>
                </p>
                <p>
                  <a href="tel:+6281234567890" className="hover:text-white">
                    +62 812 3456 7890
                  </a>
                </p>
                <p className="text-xs leading-5 pt-1">
                  Jl. Sudirman No. 123, Jakarta Pusat 10210
                </p>
              </div>
              <a
                href="#"
                className="mt-4 inline-block text-white underline underline-offset-[4px] decoration-white hover:text-[#e7ff38] text-xs font-medium"
              >
                SEE ON MAP ↗
              </a>
            </div>

            {/* Bandung */}
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/80 font-semibold mb-2">
                Bandung
              </p>
              <div className="space-y-1 text-white/90 text-left">
                <p>
                  <a
                    href="mailto:bandung@vibedaily.com"
                    className="underline underline-offset-[4px] decoration-white hover:text-white"
                  >
                    bandung@vibedaily.com
                  </a>
                </p>
                <p>
                  <a href="tel:+6222987654321" className="hover:text-white">
                    +62 22 9876 5432
                  </a>
                </p>
                <p className="text-xs leading-5 pt-1">
                  Jl. Asia Afrika No. 45, Bandung 40111
                </p>
              </div>
              <a
                href="#"
                className="mt-4 inline-block text-white underline underline-offset-[4px] decoration-white hover:text-[#e7ff38] text-xs font-medium"
              >
                SEE ON MAP ↗
              </a>
            </div>

            {/* Newsletter + Social */}
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/80 font-semibold mb-2">
                Want to be the smartest in your office?
              </p>
              <a
                href="#"
                className="inline-block mb-7 text-white underline underline-offset-[4px] decoration-white hover:text-[#e7ff38] font-semibold text-xs"
              >
                SIGN UP FOR OUR NEWSLETTER →
              </a>

              <p className="text-[11px] uppercase tracking-[0.16em] text-white/80 font-semibold mb-2 mt-2">
                Follow us
              </p>
              <div className="flex items-center gap-5 text-white/70">
                {/* Behance */}
                <a href="#" className="hover:text-white" aria-label="Behance">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M4 7h4.2a3.2 3.2 0 110 6.4H4V7zm2.1 1.8v2.8h1.9a1.4 1.4 0 100-2.8H6.1zM13.3 7H19v1.4h-5.7V7zm-.2 2.1c3.1 0 3.2 2.7 3.1 4.3H12c.3 1 .9 1.5 2 1.5.8 0 1.4-.3 1.9-.9l1.2.8c-.7 1.1-1.9 1.8-3.2 1.8-2.3 0-3.9-1.6-3.9-3.7 0-2.1 1.6-3.8 4.1-3.8zm-1.9 3h3.6c-.1-.9-.6-1.5-1.8-1.5-1.1 0-1.7.6-1.8 1.5z" />
                  </svg>
                </a>
                {/* Dribbble */}
                <a href="#" className="hover:text-white" aria-label="Dribbble">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm6.9 7.06c.47 1.84.04 3.99-1.1 5.16a6.9 6.9 0 01-.93.89 13.9 13.9 0 00-2.06-.89c.17-.41.32-.83.43-1.26 1.69.69 3.16-1.26 3.66-3.9zM9.08 20.2c1.84.47 3.99.04 5.16-1.1.34-.33.64-.71.89-1.13-.37-.64-.67-1.33-.89-2.06-.41.17-.83.32-1.26.43.69 1.69-1.26 3.16-3.9 3.86zM4.8 14.94c-.47-1.84-.04-3.99 1.1-5.16.33-.34.71-.64 1.13-.89.64.37 1.33.67 2.06.89-.17.41-.32.83-.43 1.26-1.69-.69-3.16 1.26-3.86 3.9zM14.92 3.8c-1.84-.47-3.99-.04-5.16 1.1-.34.33-.64.71-.89 1.13.37.64.67 1.33.89 2.06.41-.17.83-.32 1.26-.43-.69-1.69 1.26-3.16 3.9-3.86z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="hover:text-white" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M7.8 2h8.4A5.8 5.8 0 0122 7.8v8.4A5.8 5.8 0 0116.2 22H7.8A5.8 5.8 0 012 16.2V7.8A5.8 5.8 0 017.8 2zm0 2A3.8 3.8 0 004 7.8v8.4A3.8 3.8 0 007.8 20h8.4A3.8 3.8 0 0020 16.2V7.8A3.8 3.8 0 0016.2 4H7.8zm9.45 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="hover:text-white" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.27 18.5V10.1H5.5v8.4h2.77zM6.88 8.56a1.68 1.68 0 100-3.37 1.68 1.68 0 000 3.37zM18.5 18.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.1h-2.79v8.36h2.79v-4.93c0-.77.62-1.4 1.39-1.4.77 0 1.4.63 1.4 1.4v4.93H18.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Divider + copyright */}
          <div className="mt-12 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} VibeDaily. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      {/* ================= /PANEL GELAP ================= */}
    </footer>
  );
};

export default Footer;
