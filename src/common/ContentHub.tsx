"use client";
import React, { useRef } from "react";

const ContentHub: React.FC = () => {
  const contentHubRef = useRef<HTMLDivElement>(null);

  const scrollContentHub = (dir: "left" | "right") => {
    const container = contentHubRef.current;
    if (!container) return;
    const scrollAmount = 370;
    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white pt-12 pb-8 px-4 md:px-0 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative flex flex-col items-center mb-2 px-4 gap-4 min-h-[100px] lg:flex-row lg:px-8 lg:gap-4">
          {/* Button kiri */}
          <div className="flex-1 flex items-center justify-start w-full lg:flex-1 lg:justify-start">
            <button className="bg-black text-white font-bold rounded-full px-4 py-1 text-base md:px-7 md:py-2 md:text-lg shadow-none hover:scale-105 transition-all" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', boxShadow:'0 2px 8px 0 rgba(0,0,0,0.10)'}}>Read all articles</button>
          </div>
          {/* Heading center absolute */}
          <div className="w-full flex justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:pointer-events-none">
            <span
              style={{
                color: '#0F0F0F',
                fontSize: '40px',
                fontFamily: 'Sequel Sans Disp, Arial, sans-serif',
                fontWeight: 400,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                display: 'block',
                marginBottom: '8px',
                marginLeft: '0',
                marginRight: '0',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
              className="text-center select-none lg:text-[80px]"
            >
              Content Hub
            </span>
          </div>
          {/* Button arrow kanan */}
          <div className="flex-1 flex items-center justify-end gap-3 w-full lg:flex-1 lg:justify-end hidden lg:flex">
            {/* Arrow Left: putih, border, icon hitam */}
            <button
              className="w-12 h-12 rounded-full bg-[#f5f7fa] border border-gray-200 flex items-center justify-center shadow-none hover:bg-gray-100 transition-all"
              onClick={() => scrollContentHub("left")}
              aria-label="Scroll left"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#F5F7FA"/>
                <path d="M14.5 7L10 12L14.5 17" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {/* Arrow Right: hitam, border, icon putih */}
            <button
              className="w-12 h-12 rounded-full bg-[#36393B] border border-gray-200 flex items-center justify-center shadow-none hover:bg-gray-800 transition-all"
              onClick={() => scrollContentHub("right")}
              aria-label="Scroll right"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#36393B"/>
                <path d="M10 7L14.5 12L10 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto pb-2 px-4 md:px-8 lg:px-8" ref={contentHubRef} style={{scrollBehavior:'smooth'}}>
          <div className="flex gap-4 md:gap-6 lg:gap-8">
            {/* Example Article Card 1 */}
            <div className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[350px] bg-[#f6f6f8] rounded-[28px] shadow-none p-0 flex flex-col items-stretch border border-[#eceaea]" style={{boxShadow:'0 2px 16px 0 rgba(0,0,0,0.06)'}}>
              <div className="flex items-center justify-center pt-5">
                <div className="relative bg-[#bdb1a6] rounded-[22px] w-full max-w-[250px] md:max-w-[280px] lg:max-w-[310px] h-[200px] flex items-center justify-center mx-auto" style={{border: '10px solid #cfc5bb'}}>
                  <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Kranich Hotel" className="w-full h-full object-cover rounded-[14px]" />
                  <span className="absolute top-3 right-3 bg-white rounded-[12px] p-2 flex items-center justify-center" style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.08)', border: 'none', width: '36px', height: '36px', padding: 0}}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="0" width="28" height="28" rx="8" fill="white"/>
                      <path d="M9 19L19 9M19 9H11M19 9V17" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 px-7 pt-4 pb-6 items-center text-center">
                <div className="text-[#222] text-base mb-1 font-normal w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>October 16, 2024</div>
                <div className="text-2xl leading-tight mb-4 text-[#222] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center', fontWeight: 400}}>TOP 10 bright ideas for hotel website...</div>
                <div className="bg-white rounded-[18px] px-6 py-4 text-[#6d6d6d] text-base font-normal border border-[#eceaea] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>1. Offer virtual tours of the hotel&apos;s facilities, rooms, and common areas.</div>
              </div>
            </div>
            {/* Example Article Card 2 */}
            <div className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[350px] bg-[#f6f6f8] rounded-[28px] shadow-none p-0 flex flex-col items-stretch border border-[#eceaea]" style={{boxShadow:'0 2px 16px 0 rgba(0,0,0,0.06)'}}>
              <div className="flex items-center justify-center pt-5">
                <div className="relative bg-[#d6cfc9] rounded-[22px] w-full max-w-[250px] md:max-w-[280px] lg:max-w-[310px] h-[200px] flex items-center justify-center mx-auto" style={{border: '10px solid #e2ddd7'}}>
                  <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80" alt="Skincare Website" className="w-full h-full object-cover rounded-[14px]" />
                  <span className="absolute top-3 right-3 bg-white rounded-[12px] p-2 flex items-center justify-center" style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.08)', border: 'none', width: '36px', height: '36px', padding: 0}}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="0" width="28" height="28" rx="8" fill="white"/>
                      <path d="M9 19L19 9M19 9H11M19 9V17" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 px-7 pt-4 pb-6 items-center text-center">
                <div className="text-[#222] text-base mb-1 font-normal w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>October 17, 2024</div>
                <div className="text-2xl leading-tight mb-4 text-[#222] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center', fontWeight: 400}}>TOP 10 ideas for skincare website...</div>
                <div className="bg-white rounded-[18px] px-6 py-4 text-[#6d6d6d] text-base font-normal border border-[#eceaea] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>1. Don&apos;t underestimate your email list. It can help you build relationships with your audience,...</div>
              </div>
            </div>
            {/* Example Article Card 3 */}
            <div className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[350px] bg-[#f6f6f8] rounded-[28px] shadow-none p-0 flex flex-col items-stretch border border-[#eceaea]" style={{boxShadow:'0 2px 16px 0 rgba(0,0,0,0.06)'}}>
              <div className="flex items-center justify-center pt-5">
                <div className="relative bg-[#eaeaea] rounded-[22px] w-full max-w-[250px] md:max-w-[280px] lg:max-w-[310px] h-[200px] flex items-center justify-center mx-auto" style={{border: '10px solid #e5e5e5'}}>
                  <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80" alt="Home App" className="w-full h-full object-cover rounded-[14px]" />
                  <span className="absolute top-3 right-3 bg-white rounded-[12px] p-2 flex items-center justify-center" style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.08)', border: 'none', width: '36px', height: '36px', padding: 0}}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="0" width="28" height="28" rx="8" fill="white"/>
                      <path d="M9 19L19 9M19 9H11M19 9V17" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 px-7 pt-4 pb-6 items-center text-center">
                <div className="text-[#222] text-base mb-1 font-normal w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>October 17, 2024</div>
                <div className="text-2xl leading-tight mb-4 text-[#222] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center', fontWeight: 400}}>TOP 7 steps to create a home...</div>
                <div className="bg-white rounded-[18px] px-6 py-4 text-[#6d6d6d] text-base font-normal border border-[#eceaea] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>1. Understand the primary goal of the home screen UI. To show app features, provide quic...</div>
              </div>
            </div>
            {/* Example Article Card 4 */}
            <div className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[350px] bg-[#f6f6f8] rounded-[28px] shadow-none p-0 flex flex-col items-stretch border border-[#eceaea]" style={{boxShadow:'0 2px 16px 0 rgba(0,0,0,0.06)'}}>
              <div className="flex items-center justify-center pt-5">
                <div className="relative bg-[#eaeaea] rounded-[22px] w-full max-w-[250px] md:max-w-[280px] lg:max-w-[310px] h-[200px] flex items-center justify-center mx-auto" style={{border: '10px solid #e5e5e5'}}>
                  <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Insurance Website" className="w-full h-full object-cover rounded-[14px]" />
                  <span className="absolute top-3 right-3 bg-white rounded-[12px] p-2 flex items-center justify-center" style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.08)', border: 'none', width: '36px', height: '36px', padding: 0}}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="0" width="28" height="28" rx="8" fill="white"/>
                      <path d="M9 19L19 9M19 9H11M19 9V17" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 px-7 pt-4 pb-6 items-center text-center">
                <div className="text-[#222] text-base mb-1 font-normal w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>October 17, 2024</div>
                <div className="text-2xl leading-tight mb-4 text-[#222] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center', fontWeight: 400}}>TOP the 10: best insurance website...</div>
                <div className="bg-white rounded-[18px] px-6 py-4 text-[#6d6d6d] text-base font-normal border border-[#eceaea] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>1. The website has interactive chat support for real-time assistance.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentHub;
