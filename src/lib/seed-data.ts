import type { PortfolioItem, Testimonial } from "./content";

/** Matches the portfolio and testimonials on the live site as of October 2026. */
export const seedPortfolio: PortfolioItem[] = [
  {
    id: "a1111111-1111-4111-8111-111111111101",
    videoId: "XrR7Gh5Jmcs",
    color: "pink",
    titleEn: "REEL 01",
    titleHe: "קליפ 01",
    sortOrder: 1,
    hidden: false,
    deletedAt: null,
  },
  {
    id: "a1111111-1111-4111-8111-111111111102",
    videoId: "SnEmOxlB-EA",
    color: "green",
    titleEn: "REEL 02",
    titleHe: "קליפ 02",
    sortOrder: 2,
    hidden: false,
    deletedAt: null,
  },
  {
    id: "a1111111-1111-4111-8111-111111111103",
    videoId: "M_4yjkXI_yI",
    color: "orange",
    titleEn: "REEL 03",
    titleHe: "קליפ 03",
    sortOrder: 3,
    hidden: false,
    deletedAt: null,
  },
  {
    id: "a1111111-1111-4111-8111-111111111104",
    videoId: "5zJyrTAYKLU",
    color: "purple",
    titleEn: "REEL 04",
    titleHe: "קליפ 04",
    sortOrder: 4,
    hidden: false,
    deletedAt: null,
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "b1111111-1111-4111-8111-111111111101",
    color: "pink",
    quoteEn:
      "Carmel is a talented, creative and professional video editor whose work always brings a high standard, dedication, and results that are deeply satisfying. She is responsible, thorough and committed, and you can always count on her to give her maximum.",
    quoteHe:
      "כרמל עורכת וידאו מוכשרת, יצירתית ומקצועית, שהעבודה שלה תמיד מביאה איתה רמה גבוהה, השקעה ותוצאה שמביאה הרבה נחת. היא אחראית, יסודית ומסורה, ותמיד אפשר לסמוך עליה שתיתן את המקסימום.",
    nameEn: "AVIA ROZALIO",
    nameHe: "אביה רוזליו",
    roleEn: "MAJOR, IDF SPOKESMAN",
    roleHe: 'סרן, דובר צה"ל',
    sortOrder: 1,
    hidden: false,
    deletedAt: null,
  },
  {
    id: "b1111111-1111-4111-8111-111111111102",
    color: "purple",
    quoteEn:
      "I had the pleasure of taking part in a film Carmel shot and edited — professional, talented, and I really loved the final result.",
    quoteHe:
      "היה לי העונג להשתתף בסרט שכרמל צילמה וערכה, מקצוענית ומוכשרת ואהבתי מאוד את התוצאה הסופית.",
    nameEn: "AMIRAM TOVIM",
    nameHe: "אמירם טובים",
    roleEn: "STAND-UP COMEDIAN",
    roleHe: "סטנדאפיסט וקומיקאי",
    sortOrder: 2,
    hidden: false,
    deletedAt: null,
  },
  {
    id: "b1111111-1111-4111-8111-111111111103",
    color: "orange",
    quoteEn:
      "I came back from Africa with a camera full of photos and videos, and Carmel wove them into a moving film that earned compliments from friends and family!",
    quoteHe:
      "חזרתי מאפריקה עם מצלמה מלאה בתמונות וסרטונים, כרמל חיברה לי אותם לסרט מרגש שקטף מחמאות מחברים ומשפחה!",
    nameEn: "RONI BAR-SHAREL",
    nameHe: "רוני בר שראל",
    roleEn: "ANIMAL-ASSISTED THERAPIST",
    roleHe: "מטפלת באמצעות בע״ח",
    sortOrder: 3,
    hidden: false,
    deletedAt: null,
  },
  {
    id: "b1111111-1111-4111-8111-111111111104",
    color: "green",
    quoteEn:
      "Carmel is very creative, fast and precise, and knows how to take an idea and bring it to life without much hassle. It was really easy and pleasant to work with her, and the results came out exactly as I imagined.",
    quoteHe:
      "כרמל מאוד יצירתית, זריזה ומדויקת, ויודעת לקחת רעיון ולהוציא אותו לפועל בלי הרבה כאב ראש. היה לי ממש קל ונעים לעבוד איתה, והתוצרים יצאו בדיוק מה שחשבתי",
    nameEn: "TOHAR SAGI",
    nameHe: "טוהר שגיא",
    roleEn: "MANICURIST & CONTENT CREATOR",
    roleHe: "מניקוריסטית ויוצרת תוכן",
    sortOrder: 4,
    hidden: false,
    deletedAt: null,
  },
  {
    id: "b1111111-1111-4111-8111-111111111105",
    color: "blue",
    quoteEn: "She is a dedicated team member who contributes a lot to a film's success.",
    quoteHe: "כל צוות שיפיק ויצור סרט יזכה בה כחברת צוות משקיעה ותורמת רבות להצלחת הסרט.",
    nameEn: "YARON ROTENBERG",
    nameHe: "ירון רוטנברג",
    roleEn: "FILM TEACHER",
    roleHe: "מורה לקולנוע",
    sortOrder: 5,
    hidden: false,
    deletedAt: null,
  },
];
