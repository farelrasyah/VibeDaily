// SocialMediaSection.tsx
import React from "react";
/**
 * SocialMediaSection
 * - IG cards sama seperti sebelumnya
 * - Featured News: dibuat mengikuti referensi (badge kecil di luar kartu, sudut asimetris,
 *   shadow halus, meta netral, headline rapat, CTA 2 elemen terpisah)
 */

const BG_URL =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop&auto=format";

const IMAGES = [
  "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=1200&h=1600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=1200&h=1600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=1600&fit=crop&auto=format",
];

type CardProps = {
  img: string;
  blueBar?: boolean;
  className?: string;
};

function InstaCard({ img, blueBar = false, className = "" }: CardProps) {
  return (
    <div
      className={[
        "group relative w-[280px] sm:w-[320px] md:w-[360px] lg:w-[390px] h-[420px] sm:h-[480px] md:h-[520px] lg:h-[570px] rounded-[24px] sm:rounded-[28px]",
        "bg-white/10 backdrop-blur-xl border border-white/20",
        "shadow-[0_28px_110px_-14px_rgba(0,0,0,0.28)]",
        "overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* Header - responsive */}
      <div className="h-[60px] sm:h-[68px] md:h-[72px] px-4 sm:px-5 flex items-center justify-between bg-white/15 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-[2px] sm:p-[3px] rounded-full bg-gradient-to-tr from-rose-400/80 via-purple-500/80 to-blue-500/80">
            <div className="p-[2px] sm:p-[3px] bg-white/90 rounded-full">
              <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full bg-gradient-to-tr from-rose-500 to-blue-600 grid place-items-center">
                <span className="text-white font-bold text-[10px] sm:text-[11px] md:text-[12px]">V</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold text-white/90 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/15">
            VibeDaily
          </span>
        </div>
        <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white/80" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>

      {/* Media - responsive */}
      <div className="relative h-[240px] sm:h-[280px] md:h-[320px] lg:h-[336px] overflow-hidden">
        <img
          src={img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 lg:h-36 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
      {/* Footer – responsive */}
      <div
        className={[
          "h-[70px] sm:h-[80px] md:h-[88px] lg:h-[92px] border-t border-white/10 flex items-center justify-between px-4 sm:px-5",
          blueBar ? "bg-gradient-to-r from-blue-500/35 to-purple-600/35" : "bg-white/25",
          "backdrop-blur-md",
        ].join(" ")}
      >
        <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
          <svg viewBox="0 0 24 24" className="w-5 sm:w-6 h-5 sm:h-6 text-rose-500 fill-current">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z" />
          </svg>
          <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <svg className="w-6 h-6 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </div>
    </div>
  );
}
const SocialMediaSection: React.FC = () => {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      {/* Glass container - responsive */}
      <div className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[40px] xl:rounded-[48px] border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_40px_140px_-30px_rgba(0,0,0,0.5)]">
        {/* Background layers */}
        <div className="absolute inset-0 -z-10">
          <img src={BG_URL} alt="Background" className="w-full h-full object-cover scale-110 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-800/30 to-rose-700/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <div className="absolute inset-0 ring-1 ring-white/10 rounded-[inherit] pointer-events-none" />
        </div>
        {/* === FEATURED NEWS (mimik referensi) === */}
        <div className="absolute left-0 bottom-[-8px] md:bottom-[-12px] z-30 p-0">
          <article
            className={[
              // ukuran dan padding kartu
              "relative bg-white/60 backdrop-blur-xl",
              "px-8 py-7 sm:px-10 sm:py-8",
              // sudut asimetris: TL besar, yang lain sedang
              "rounded-[28px] rounded-tl-[56px]",
              // width mirip referensi
              "max-w-[520px] min-w-[360px]",
            ].join(" ")}
          >
          
            {/* Meta: netral (bukan ungu), bullet kecil & rapat */}
            <div className="mb-3 flex items-center gap-2 text-[13px] text-black/60">
              <span className="font-medium">Branding</span>
              <span className="opacity-60">•</span>
              <span>a year ago</span>
            </div>

            {/* Headline: bold, leading tight, max 3 baris */}
            <h2 className="text-[28px] sm:text-[32px] font-extrabold text-black leading-tight tracking-[-0.01em] max-w-[32ch] mb-3">
              Corporate identity design that ensures brand recognition
            </h2>

            {/* Tags: satu blok rapih, abu-abu */}
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-[13px] text-black/55">
              <li>#Brand identity design</li>
              <li>#Corporate website design</li>
              <li>#Website ui design</li>
            </ul>

            {/* CTA: tombol pil + icon button terpisah, warna biru muda */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center rounded-full border border-black/10 bg-[#E9F0FF] px-5 py-3 text-[15px] font-semibold text-black transition-colors hover:bg-[#dfe8ff]"
              >
                Read article
              </a>
              <a
                href="#"
                aria-label="Open article"
                className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-[#E9F0FF] transition-transform hover:bg-[#dfe8ff] hover:translate-x-[2px]"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </article>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-10 xl:px-12 py-10 md:py-14">
          <div className="grid grid-cols-1 gap-y-10">
            {/* Instagram Cards */}
            <div className="flex justify-center items-center">
              <InstaCard img={IMAGES[0]} className="scale-90 -ml-4 z-10" />
              <InstaCard img={IMAGES[1]} className="z-20" />
              <InstaCard img={IMAGES[2]} className="scale-90 -mr-4 z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
