import VideoTicketCard from "./VideoTicketCard";
import StackReveal from "./StackReveal";
import { VideoPlaybackProvider } from "./VideoPlaybackContext";

const reels: {
  videoId: string;
  title: string;
  color: "pink" | "green" | "orange" | "purple";
}[] = [
  { videoId: "XrR7Gh5Jmcs", title: "REEL 01", color: "pink" },
  { videoId: "SnEmOxlB-EA", title: "REEL 02", color: "green" },
  { videoId: "M_4yjkXI_yI", title: "REEL 03", color: "orange" },
  { videoId: "5zJyrTAYKLU", title: "REEL 04", color: "purple" },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-cream/60">
          [ Your ticket to visual storytelling ]
        </p>
        <h2 className="mb-12 font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          COME ON IN:
          <br />
          EXPLORE MY CREATIVE SHOWCASE
        </h2>

        <VideoPlaybackProvider>
          <StackReveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reels.map((reel) => (
              <VideoTicketCard key={reel.videoId} {...reel} />
            ))}
          </StackReveal>
        </VideoPlaybackProvider>

        <div className="mt-14 flex justify-center">
          <a
            href="https://instagram.com/carmelbartov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-yellow px-8 py-4 font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Check out more projects
          </a>
        </div>
      </div>
    </section>
  );
}
