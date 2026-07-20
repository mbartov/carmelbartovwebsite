import type { Metadata } from "next";
import { Anton, Inter, Rubik } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

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
  title: "Carmel Bartov — Video Editor & Content Creator",
  description:
    "Carmel Bartov is a video editor and content creator. Your story's backstage pass.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${anton.variable} ${rubik.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("lang");if(l!=="en"&&l!=="he"){l=navigator.language.toLowerCase().indexOf("he")===0?"he":"en"}document.documentElement.lang=l;document.documentElement.dir=l==="he"?"rtl":"ltr"}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-ink text-cream font-sans overflow-x-hidden overflow-y-visible">
        <LanguageProvider>
          <LanguageToggle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
