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
    <section className="w-full mx-auto max-w-[1200px] px-6 py-16">
      {/* Header with purple line and View more button */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative">
          <div className="w-8 h-[3px] bg-accent-purple rounded-full mb-3"></div>
          <span className="block uppercase text-sm font-bold tracking-wider text-foreground">
            WEB DESIGN
          </span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-base font-semibold text-foreground hover:opacity-70 transition-opacity"
        >
          View more →
        </button>
      </div>

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
        {/* Featured article: span 2 columns, adjusted height */}
        <div className="relative rounded-3xl overflow-hidden h-[260px] lg:h-[500px] lg:col-span-2">
          {/* Background image */}
          <img
            src={articles[0].image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-featured-gradient-start/20 via-featured-gradient-mid/60 to-featured-gradient-end/90" />

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

        {/* Right grid: 2 columns x 3 rows */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8">
            {rightItems.map((article, idx) => (
              <div
                key={idx}
                className={`group flex items-start gap-4 py-6 border-b border-border-light last:border-b-0 ${
                  idx >= 4 ? "md:border-b-0" : ""
                }`}
              >
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-2 text-sm text-text-muted">
                    <span>{article.category}</span>
                    <span>• {article.time}</span>
                  </div>

                  <h3 className="text-lg lg:text-xl font-bold text-foreground leading-tight mb-3 group-hover:opacity-90 transition-opacity line-clamp-2">
                    {article.title}
                  </h3>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-sm text-text-ultra-muted">
                      {article.tags.map((tag, j) => (
                        <span key={j} className="hover:text-text-muted transition-colors cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden bg-thumbnail-bg flex-shrink-0">
                  <img
                    src={article.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;