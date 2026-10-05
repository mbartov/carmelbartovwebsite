import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Anton, Inter, Rubik } from "next/font/google";
import "./globals.css";
import { LanguageProvider, type Lang } from "@/components/LanguageContext";
import SiteChrome from "@/components/SiteChrome";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

/* Rubik has Hebrew glyphs; Anton does not — used as Hebrew display fallback */
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
  weight: ["700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carmel Bartov — Video Editor & Content Producer",
  description:
    "Carmel Bartov is a video editor and content producer. Your story's backstage pass.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value;
  const initialLang: Lang = cookieLang === "he" ? "he" : "en";

  return (
    <html
      lang={initialLang}
      dir={initialLang === "he" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${anton.variable} ${rubik.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p==="/admin"||p.indexOf("/admin/")===0){document.documentElement.lang="he";document.documentElement.dir="rtl";return}var l=localStorage.getItem("lang");if(l!=="en"&&l!=="he"){l=navigator.language.toLowerCase().indexOf("he")===0?"he":"en"}document.documentElement.lang=l;document.documentElement.dir=l==="he"?"rtl":"ltr";document.cookie="lang="+l+";path=/;max-age=31536000;SameSite=Lax"}catch(e){}})()`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-ink text-cream font-sans overflow-x-hidden overflow-y-visible"
      >
        <LanguageProvider initialLang={initialLang}>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
