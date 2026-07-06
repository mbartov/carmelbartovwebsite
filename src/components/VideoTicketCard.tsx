"use client";

import { useState } from "react";
import Image from "next/image";

const colorMap: Record<string, string> = {
  pink: "bg-pink-bright",
  green: "bg-green",
  orange: "bg-orange",
  purple: "bg-purple",
  blue: "bg-blue",
};

type Props = {
  videoId: string;
  category: string;
  title: string;
  color: keyof typeof colorMap;
};

export default function VideoTicketCard({ videoId, category, title, color }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`ticket-scallop flex flex-col border-[3px] border-ink p-4 text-ink ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-widest sm:text-xs">
        <span>Now screening</span>
        <span>Full HD</span>
      </div>

      <div className="relative mt-3 aspect-[9/16] w-full overflow-hidden rounded-lg border-2 border-ink bg-ink">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center"
            aria-label={`Play ${title}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-cream text-ink shadow-lg transition-transform group-hover:scale-110">
              &#9654;
            </span>
          </button>
        )}
      </div>

      <p className="mt-3 text-xs font-medium uppercase tracking-widest opacity-70">
        {category}
      </p>
      <p className="font-display text-2xl leading-none sm:text-3xl">{title}</p>

      <div className="mt-4 flex items-center justify-between border-t-2 border-dotted border-ink/50 pt-3 text-[10px] uppercase tracking-widest opacity-70">
        <span>Live from the edit bay</span>
        <span>@carmelbartov</span>
      </div>
    </div>
  );
}
