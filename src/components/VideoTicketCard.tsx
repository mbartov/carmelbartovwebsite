"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackSiteEvent } from "@/lib/analytics";
import { colorMap, type CardColor } from "@/lib/colors";
import { loadYouTubeIframeApi, type YTPlayer } from "@/lib/youtubeIframeApi";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useVideoPlayback } from "./VideoPlaybackContext";
import { useLanguage } from "./LanguageContext";

const copy = {
  en: {
    nowScreening: "Now screening",
    pause: (title: string) => `Pause ${title}`,
    play: (title: string) => `Play ${title}`,
    liveFromEditBay: "Live from the edit bay",
  },
  he: {
    nowScreening: "כעת מוקרן",
    pause: (title: string) => `השהה ${title}`,
    play: (title: string) => `נגן ${title}`,
    liveFromEditBay: "בשידור חי מחדר העריכה",
  },
};

type Props = {
  videoId: string;
  title: string;
  color: CardColor;
};

export default function VideoTicketCard({
  videoId,
  title,
  color,
}: Props) {
  const { activeId, play, stop } = useVideoPlayback();
  const { lang } = useLanguage();
  const pathname = usePathname();
  const t = copy[lang];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountWrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerReadyRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isHoverCapable = useMediaQuery("(hover: hover) and (pointer: fine)");

  const withReadyPlayer = (action: (player: YTPlayer) => void) => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;
    action(player);
  };

  // Mount the player immediately (not gated behind a click) so the iframe and
  // its player script are already warmed up by the time the user wants to
  // watch — this is the "preload" for instant start/stop.
  //
  // YT.Player destructively replaces its target element with an iframe, and
  // destroy() only removes that iframe (it doesn't restore the original
  // element). React 18 Strict Mode runs this effect twice on mount (setup,
  // cleanup, setup again) — reusing a static target id broke the second
  // construction, since by then the first destroy() had already removed the
  // only element with that id. Creating a fresh child element per effect run
  // sidesteps that entirely.
  useEffect(() => {
    let cancelled = false;
    const wrapper = mountWrapperRef.current;
    if (!wrapper) return;
    const target = document.createElement("div");
    target.className = "absolute inset-0 h-full w-full";
    wrapper.appendChild(target);

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(target, {
        videoId,
        playerVars: { rel: 0, playsinline: 1, modestbranding: 1 },
        events: {
          onReady: () => {
            if (cancelled) return;
            playerReadyRef.current = true;
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              play(videoId);
            } else if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
              stop(videoId);
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerReadyRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;
      target.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Only one reel plays at a time: pause as soon as a different card claims
  // the active slot.
  useEffect(() => {
    if (activeId !== videoId && isPlaying) {
      withReadyPlayer((player) => player.pauseVideo());
    }
  }, [activeId, videoId, isPlaying]);

  // Mobile/touch: autoplay once 60%+ of the card is in view.
  useEffect(() => {
    if (isHoverCapable) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        withReadyPlayer((player) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            player.mute();
            player.playVideo();
          } else {
            player.pauseVideo();
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHoverCapable]);

  const handleMouseEnter = () => {
    if (!isHoverCapable) return;
    withReadyPlayer((player) => {
      player.mute();
      player.playVideo();
    });
  };

  const handleMouseLeave = () => {
    if (!isHoverCapable) return;
    withReadyPlayer((player) => player.pauseVideo());
  };

  const handlePlayClick = () => {
    withReadyPlayer((player) => {
      if (isPlaying) {
        player.pauseVideo();
        return;
      }
      trackSiteEvent("Video Play", lang, {
        title,
        page: pathname === "/portfolio" ? "portfolio" : "home",
      });
      player.unMute();
      player.playVideo();
    });
  };

  return (
    <div
      className={`ticket-scallop flex flex-col border-[3px] border-ink p-4 text-ink ${colorMap[color]}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-widest sm:text-xs">
        <span>{t.nowScreening}</span>
        <span>Full HD</span>
      </div>

      <div
        ref={containerRef}
        className="relative mt-3 aspect-[9/16] w-full overflow-hidden rounded-lg border-2 border-ink bg-ink"
      >
        <div ref={mountWrapperRef} className="absolute inset-0 h-full w-full" />

        {/* The live YouTube embed (always mounted, see effect above) shows
            its own correctly-aspected paused thumbnail underneath — a static
            hqdefault.jpg was tried here first, but for these Shorts it comes
            back as a 4:3 frame with YouTube's own player chrome baked in,
            which object-cover had to crop/zoom hard into a 9:16 box. That
            distortion is what read as "stretched", worse on the bigger
            mobile card size. */}
        <button
          type="button"
          onClick={handlePlayClick}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={isPlaying ? t.pause(title) : t.play(title)}
        >
          <span
            className={`absolute inset-0 bg-ink/30 transition-opacity ${
              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          />
          <span
            className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-cream text-ink shadow-lg transition-all group-hover:scale-110 ${
              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            {isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>}
          </span>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between border-t-2 border-dotted border-ink/50 pt-3 text-[10px] uppercase tracking-widest opacity-70">
        <span>{t.liveFromEditBay}</span>
        <span>@carmelbartov</span>
      </div>
    </div>
  );
}
