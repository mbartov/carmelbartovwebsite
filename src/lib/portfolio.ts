export const portfolioColors = [
  "pink",
  "green",
  "orange",
  "purple",
  "blue",
] as const;

export type PortfolioColor = (typeof portfolioColors)[number];

export type PortfolioProject = {
  id: string;
  videoId: string;
  color: PortfolioColor;
  title: {
    en: string;
    he: string;
  };
  /** Shown in the home page showcase */
  featured?: boolean;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "reel-01",
    videoId: "XrR7Gh5Jmcs",
    color: "pink",
    title: { en: "REEL 01", he: "קליפ 01" },
    featured: true,
  },
  {
    id: "reel-02",
    videoId: "SnEmOxlB-EA",
    color: "green",
    title: { en: "REEL 02", he: "קליפ 02" },
    featured: true,
  },
  {
    id: "reel-03",
    videoId: "M_4yjkXI_yI",
    color: "orange",
    title: { en: "REEL 03", he: "קליפ 03" },
    featured: true,
  },
  {
    id: "reel-04",
    videoId: "5zJyrTAYKLU",
    color: "purple",
    title: { en: "REEL 04", he: "קליפ 04" },
    featured: true,
  },
  // Add more projects below — they will appear on /portfolio automatically.
];

export function getFeaturedProjects() {
  return portfolioProjects.filter((project) => project.featured);
}

export function getAllProjects() {
  return portfolioProjects;
}

export function projectTitle(project: PortfolioProject, lang: "en" | "he") {
  return project.title[lang];
}
