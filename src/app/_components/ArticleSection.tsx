import React from "react";


// Dummy data with random images from picsum.photos
const articles = [
  {
    category: "Web design",
    time: "a year ago",
    title: "How to create a stylish website design for software company",
    description:
      "1. Keep it simple. Minimalism is about choosing the right content, keeping media to a minimum, going for a full-screen design, and avoiding lengthy hamburger menus if they're not easy to navigate. So, filter ui designs...",
    image: `https://picsum.photos/800/600?random=101`,
    tags: ["Web design"],
  },
  {
    category: "Web design",
    time: "a year ago",
    title: "Innovative automotive web design based on 2024 trends",
    description:
      "Automotive web design is evolving with new trends in 2024. Discover the latest creative approaches for your next project.",
    image: `https://picsum.photos/200/200?random=102`,
    tags: ["Automotive web design", "Creative website"],
  },
  {
    category: "Web design",
    time: "a year ago",
    title:
      "How to make a financial website design that reflects reliability and professionalism",
    description:
      "Financial website design must reflect trust and professionalism. Here's how to achieve it in your next project.",
    image: `https://picsum.photos/200/200?random=103`,
    tags: ["Financial website design", "Page designs"],
  },
  {
    category: "Web design",
    time: "a year ago",
    title:
      "Furniture website design: how to create a stylish space in 5 steps",
    description:
      "Create a stylish furniture website in 5 easy steps. Tips and tricks for modern page designs.",
    image: `https://picsum.photos/200/200?random=104`,
    tags: ["Furniture website design", "Page designs"],
  },
  {
    category: "Web design",
    time: "a year ago",
    title: "What should a small business website design contain?",
    description:
      "Small business websites need the right content and design. Here's what to include for success.",
    image: `https://picsum.photos/200/200?random=105`,
    tags: ["Business web design"],
  },
  {
    category: "Blog",
    time: "a year ago",
    title:
      "What is it important to know before making a news page design?",
    description:
      "Before making a news page, know these important design principles for better engagement.",
    image: `https://picsum.photos/200/200?random=106`,
    tags: ["News website design", "News page design"],
  },
  {
    category: "Web design",
    time: "a year ago",
    title:
      "We share current trends on how to make a university website design",
    description:
      "Trends and practical advice to build better university websites.",
    image: `https://picsum.photos/200/200?random=107`,
    tags: ["University website design"],
  },
];

const ArticleSection: React.FC = () => {
  // Right items (6 articles) — take from index 1..6
  const rightItems = articles.slice(1, 7);

  return (
    <section className="w-full mx-auto max-w-[1200px] px-6 py-16 relative">
      {/* Flag "NEWS UPDATE" */}
      <div className="absolute -top-8 left-0 mb-8 mt-2">
        <div className="flex items-center relative">
          <div className="w-0.5 h-6 bg-violet-600 rounded-full z-10"></div>
          <div className="relative -ml-0.5">
            <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide pl-1">
              NEWS UPDATE
            </span>
            {/* Violet fade effect overlay starting from left */}
            <div className="absolute inset-0 left-0 bg-gradient-to-r from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Header with View more button */}
      <div className="flex items-center justify-end mb-8">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-base font-semibold text-foreground hover:opacity-70 transition-opacity"
        >
          View more →
        </button>
      </div>

      {/* Main grid layout like ArticleGrid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-4">
        {/* Featured article: span 3.2 columns (slightly wider) */}
        <div className="lg:col-span-3 lg:-ml-8">
          <div className="relative rounded-3xl overflow-hidden h-[260px] lg:h-[500px]">
            {/* Background image */}
            <img
              src={articles[0].image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="featured-gradient" />

            {/* Content overlay */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-8">
              <div className="mb-2 flex items-center gap-2 text-white/80 text-sm">
                <span className="font-medium">{articles[0].category}</span>
                <span>• {articles[0].time}</span>
              </div>

              <h2 className="text-white font-bold leading-tight text-xl lg:text-2xl mb-3 max-w-[90%]">
                {articles[0].title}
              </h2>

              <p className="text-white/90 text-sm lg:text-base max-w-[95%] leading-relaxed">
                {articles[0].description}
              </p>
            </div>
          </div>
        </div>

        {/* Right grid: 2 columns with larger cards - expanded width */}
        <div className="lg:col-span-2 relative">
          <div className="lg:pl-6 xl:pl-10 relative">
            {/* Allow the grid to overflow and be wider than its container */}
            <div className="relative lg:absolute lg:-top-4 lg:right-0 lg:w-[240%] lg:translate-x-115">
              <div className="grid grid-cols-2 gap-x-10 gap-y-0">
                {rightItems.map((article, idx) => (
                  <article key={idx} className="group">
                    <a href="#" className="block hover:opacity-80 transition-opacity">
                      <div className="flex items-start gap-4 py-6 px-0 min-h-[140px]">
                        {/* Text content on the left */}
                        <div className="flex-1 min-w-0 flex flex-col justify-start">
                          <div className="mb-2 text-sm font-medium">
                            <span className="text-[#567FB0] font-semibold">{article.category}</span>
                            <span className="mx-2 text-slate-400">•</span>
                            <span className="text-slate-500">{article.time}</span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight line-clamp-3 flex-grow">
                            {article.title}
                          </h3>

                          <div className="text-sm text-slate-500 mt-auto">
                            {article.tags && article.tags.length > 0 ? (
                              <>#{article.tags[0]}</>
                            ) : (
                              <>#{article.category}</>
                            )}
                          </div>
                        </div>

                        {/* Image on the right - consistent size */}
                        <div className="flex-shrink-0 w-16 h-16 lg:w-18 lg:h-18 rounded-xl overflow-hidden self-start mt-1">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      {/* Separator line - subtle but visible */}
                      {idx < rightItems.length - 1 && (
                        <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-4 my-0" />
                      )}
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;