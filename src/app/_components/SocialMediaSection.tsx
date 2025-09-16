import React from "react";

/**
 * SocialMediaSection – Duplicate persis layout referensi (desktop-first)
 * - Grid SELALU 2 kolom: [kiri 480px] + [kanan fleksibel, min 980px]
 * - Deck 3 kartu IG absolute DI DALAM kolom kanan (overlap rapi)
 * - Artikel kiri self-end (menempel bawah)
 * - BG: foto blur + haze ungu kanan
 * - Auto horizontal scroll bila viewport < kanvas desain (agar komposisi tetap sama)
 */

const BG_URL = "https://picsum.photos/1600/900?random=160";
const IMAGES = [
  "https://picsum.photos/560/315?random=161",
  "https://picsum.photos/560/315?random=162", // center
  "https://picsum.photos/560/315?random=163",
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
        "relative w-[420px] h-[610px] rounded-[30px] bg-white/95",
        "shadow-[0_30px_90px_-25px_rgba(0,0,0,0.55)] border border-white/70",
        "overflow-hidden backdrop-blur-sm ring-1 ring-white/35",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="h-[78px] px-5 flex items-center justify-between bg-white/90">
        <div className="flex items-center gap-3">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-fuchsia-600">
            <div className="p-[2px] bg-white rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-600" />
            </div>
          </div>
          <span className="text-sm font-semibold text-white bg-[#0a48b3] px-3 py-1 rounded-md">
            Lapinta_bog
          </span>
        </div>
        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>

      {/* Konten */}
      <div className="relative h-[360px]">
        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 ring-1 ring-white/30 pointer-events-none" />
      </div>

      {/* Footer */}
      {blueBar ? (
        <div className="h-[96px] bg-[#0b5bd3] flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-rose-300 fill-current">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z"/>
            </svg>
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </div>
      ) : (
        <div className="h-[96px] bg-white/95 flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-rose-600 fill-current">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z"/>
            </svg>
            <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </div>
      )}
    </div>
  );
}

const SocialMediaSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      {/* BG foto + haze ungu */}
      <div className="absolute inset-0">
        <img src={BG_URL} alt="" className="w-full h-full object-cover scale-[1.08] blur-[6px]" />
        <div className="absolute inset-0 bg-gradient-to-l from-violet-600/55 via-violet-500/30 to-transparent" />
      </div>

      {/* Stage container (bisa scroll horizontal kalau viewport sempit) */}
      <div className="relative z-10 w-full overflow-x-auto">
        <div className="mx-5 sm:mx-8 mt-6 mb-10 min-w-[1200px]">
          <div className="rounded-[28px] overflow-hidden">
            <div className="px-6 md:px-8 lg:px-10 pt-10 pb-16">
              {/* SELALU 2 kolom */}
              <div className="grid grid-cols-[480px_minmax(980px,1fr)] gap-12 items-end">
                {/* LEFT – Article card (self-end) */}
                <div className="relative self-end">
                  {/* Badge + strip ungu */}
                  <div className="absolute -top-10 left-2 flex items-center">
                    <span className="w-1.5 h-4 rounded bg-fuchsia-600 mr-2" />
                    <span className="inline-flex items-center rounded-full border border-blue-200 px-3 py-[6px] text-[11px] font-extrabold tracking-wider text-blue-600 uppercase bg-white/90 backdrop-blur">
                      Featured News
                    </span>
                  </div>

                  <div className="bg-white rounded-[30px] p-8 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.55)]">
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-blue-600 font-semibold">Branding</span>
                      <span>•</span>
                      <span>a year ago</span>
                    </div>

                    <h2 className="text-[36px] leading-[1.06] font-extrabold text-gray-900">
                      Corporate identity design that ensures brand recognition
                    </h2>

                    <ul className="mt-6 space-y-1 text-[14px] text-gray-500">
                      <li>#Brand identity design</li>
                      <li>#Corporate website design</li>
                      <li>#Website ui design</li>
                    </ul>

                    <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-100 hover:bg-gray-200 transition px-5 py-3 text-[14px] font-semibold text-gray-900">
                      Read article
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white ring-1 ring-gray-300">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>

                {/* RIGHT – Deck 3 kartu (absolute di dalam kolom kanan) */}
                <div className="relative min-w-[980px] h-[660px]">
                  {/* Ground shadow */}
                  <div className="absolute left-16 right-16 bottom-7 h-10 bg-black/35 blur-[18px] rounded-full" />
                  {/* Left card */}
                  <div className="absolute left-0 top-6 scale-[.96] z-[5]">
                    <InstaCard img={IMAGES[0]} />
                  </div>
                  {/* Center card */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 z-[10]">
                    <InstaCard img={IMAGES[1]} blueBar />
                  </div>
                  {/* Right card */}
                  <div className="absolute right-0 top-6 scale-[.96] z-[6]">
                    <InstaCard img={IMAGES[2]} />
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
