import React from "react";

/**
 * SocialMediaSection – gutters kiri/kanan simetris + tepi super halus
 * - Spasi luar simetris: section px-8/12/16/20 + max-w container
 * - Tidak ada elemen yang menempel ke sisi kanan: deck punya padding internal
 * - Rounded besar + vignette untuk pinggiran smooth
 */

const BG_URL =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop&auto=format";

const IMAGES = [
  "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=560&h=315&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=560&h=315&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=560&h=315&fit=crop&auto=format",
];

function InstaCard({
  img,
  blueBar = false,
  className = "",
}: {
  img: string;
  blueBar?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "group relative w-[420px] h-[610px] rounded-[32px]",
        "bg-white/10 backdrop-blur-xl border border-white/20",
        "shadow-[0_32px_120px_-12px_rgba(0,0,0,0.25)]",
        "hover:shadow-[0_48px_140px_-12px_rgba(0,0,0,0.35)]",
        "overflow-hidden transition-all duration-700 ease-out",
        "hover:scale-[1.02] hover:-translate-y-2",
        "before:absolute before:inset-0 before:rounded-[32px]",
        "before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent",
        "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="h-[78px] px-6 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-[3px] rounded-full bg-gradient-to-tr from-rose-400/80 via-purple-500/80 to-blue-500/80 transition-all duration-300 hover:from-rose-400 hover:via-purple-500 hover:to-blue-500">
            <div className="p-[3px] bg-white/90 rounded-full">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
            </div>
          </div>
          <span className="text-sm font-semibold text-white bg-gradient-to-r from-blue-500/90 to-purple-600/90 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
            VibeDaily
          </span>
        </div>
        <div className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 cursor-pointer">
          <svg className="w-5 h-5 text-white/80 hover:text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>
      </div>

      {/* Media */}
      <div className="relative h-[360px] overflow-hidden">
        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-medium">View Story</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {blueBar ? (
        <div className="h-[96px] bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <button className="group/btn p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-rose-400 fill-current group-hover/btn:text-rose-300 group-hover/btn:scale-110">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <button className="group/btn p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
              <svg className="w-6 h-6 text-white/80 group-hover/btn:text-white group-hover/btn:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button className="group/btn p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
              <svg className="w-6 h-6 text-white/80 group-hover/btn:text-white group-hover/btn:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <button className="group/btn p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
            <svg className="w-6 h-6 text-white/80 group-hover/btn:text-white group-hover/btn:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="h-[96px] bg-white/10 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <button className="group/btn p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-rose-500 fill-current group-hover/btn:text-rose-400 group-hover/btn:scale-110">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <button className="group/btn p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
              <svg className="w-6 h-6 text-white/80 group-hover/btn:text-white group-hover/btn:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button className="group/btn p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
              <svg className="w-6 h-6 text-white/80 group-hover/btn:text-white group-hover/btn:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <button className="group/btn p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
            <svg className="w-6 h-6 text-white/80 group-hover/btn:text-white group-hover/btn:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

const SocialMediaSection: React.FC = () => {
  return (
    <section
      className={[
        // align section gutters with page wrapper (px-4 sm:px-6 lg:px-8)
        "relative w-full",
        "px-4 sm:px-6 lg:px-8",
        "py-8 md:py-12",
      ].join(" ")}
    >
      {/* Glass container besar (centered, max width) */}
      <div
        className={[
          "relative overflow-hidden",
          // make the glass container stretch full width inside the section
          // so it can occupy more horizontal space; we'll keep an inner
          // centered wrapper for controlling the visible 'card' width
          "w-full mx-auto",
          "rounded-[32px] md:rounded-[40px] xl:rounded-[48px]",
          "border border-white/15 bg-white/[0.06] backdrop-blur-xl",
          "shadow-[0_40px_140px_-30px_rgba(0,0,0,0.5)]",
        ].join(" ")}
      >
        {/* inner width limiter (controls visible card width) */}
  <div className="mx-auto w-full max-w-[1200px] px-6 lg:-ml-8">
        {/* Background layers */}
        <div className="absolute inset-0 -z-10">
          <img src={BG_URL} alt="Background" className="w-full h-full object-cover scale-110 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-800/30 to-rose-700/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,105,180,0.18),transparent_55%)]" />
          {/* Vignette lembut */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 rounded-[inherit]" />
          <div className="pointer-events-none absolute inset-[-1px] rounded-[inherit] bg-[radial-gradient(1300px_500px_at_center,rgba(255,255,255,0.06),transparent_70%)]" />
        </div>

        {/* Content container (ikut max-w, padding internal simetris) */}
        <div className="relative z-10 px-6 md:px-10 xl:px-12 py-10 md:py-14">
          <div className="grid grid-cols-1 xl:grid-cols-[520px_1fr] xl:items-end gap-y-10">
            {/* LEFT */}
            <div className="relative group/article order-2 xl:order-1">
              <div className="absolute -top-10 md:-top-12 left-2 md:left-0 flex items-center z-20">
                <div className="w-2 h-6 bg-gradient-to-b from-rose-400 to-purple-600 rounded-full mr-3 shadow-lg" />
                <span className="inline-flex items-center rounded-2xl border border-white/30 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase bg-white/10 backdrop-blur-xl shadow-xl">
                  <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2 animate-pulse" />
                  Featured News
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] md:rounded-[36px] p-8 lg:p-10 shadow-[0_48px_140px_-20px_rgba(0,0,0,0.45)] transition-all duration-700 group-hover/article:scale-[1.02] group-hover/article:-translate-y-2">
                <div className="mb-6 flex items-center gap-3 text-sm">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-200 font-semibold rounded-xl border border-blue-400/20 backdrop-blur-sm">
                    Branding
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="text-white/60 font-medium">a year ago</span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-[40px] leading-[1.1] font-bold text-white mb-4 tracking-tight">
                  Corporate identity design that ensures brand recognition
                </h2>

                <div className="flex flex-col gap-1 mb-8 text-sm text-white/70">
                  <span>#Brand identity design</span>
                  <span>#Corporate website design</span>
                  <span>#Website ui design</span>
                </div>

                <button className="group/btn inline-flex items-center gap-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 px-6 py-3 text-white font-semibold text-sm shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20">
                  Read article
                  <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 group-hover/btn:bg-white/30 transition-all duration-300">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* RIGHT – Deck (punya padding internal supaya kartu kanan tidak nempel) */}
            <div className="relative order-1 xl:order-2 w-full h-[520px] md:h-[620px] lg:h-[700px] xl:h-[720px] px-2 md:px-4 xl:px-6">
              <div className="relative w-full h-full">
                {/* ground shadows */}
                <div className="absolute left-6 right-6 bottom-4 h-8 bg-black/20 blur-[20px] rounded-full" />
                <div className="absolute left-4 right-4 bottom-6 h-12 bg-black/15 blur-[25px] rounded-full" />

                {/* Mobile */}
                <div className="xl:hidden flex items-center justify-center h-full">
                  <div className="scale-90">
                    <InstaCard img={IMAGES[1]} blueBar />
                  </div>
                </div>

                {/* Desktop: 3 kartu; kiri dan kanan mengikuti padding xl:px-6 di wrapper ini */}
                <div className="hidden xl:block w-full h-full">
                  {/* Left */}
                  <div className="absolute left-0 top-8 scale-[0.94] z-[5] hover:scale-[0.97] transition-all duration-500">
                    <InstaCard img={IMAGES[0]} />
                  </div>

                  {/* Center */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 z-[10] hover:scale-[1.03] transition-all duration-500">
                    <InstaCard img={IMAGES[1]} blueBar />
                  </div>

                  {/* Right */}
                  <div className="absolute right-0 top-8 scale-[0.94] z-[6] hover:scale-[0.97] transition-all duration-500">
                    <InstaCard img={IMAGES[2]} />
                  </div>

                  {/* Glow */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[420px] h-[610px] bg-gradient-to-r from-blue-500/10 via-purple-500/15 to-rose-500/10 rounded-[32px] blur-3xl z-[1]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
