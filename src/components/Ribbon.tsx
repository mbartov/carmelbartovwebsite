const unit = "AVAILABLE FOR NEW PROJECTS";
const tiny = "CARMEL BARTOV · VIDEO EDITOR · ©2026";

function Segment({ i }: { i: number }) {
  const isDark = i % 2 === 0;
  return (
    <div
      className={`flex items-center gap-4 border-x-2 border-ink px-6 py-4 ${
        isDark ? "bg-purple text-cream" : "bg-cream text-ink"
      }`}
    >
      <span className="text-lg">&#10047;</span>
      <span className="whitespace-nowrap font-display text-2xl sm:text-4xl">
        {unit}
      </span>
      <span className="whitespace-nowrap text-[10px] uppercase tracking-widest opacity-70 sm:text-xs">
        {tiny}
      </span>
    </div>
  );
}

export default function Ribbon() {
  return (
    <div className="overflow-hidden bg-ink py-10">
      <div className="-rotate-2 border-y-2 border-ink">
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee">
            {Array.from({ length: 8 }).map((_, i) => (
              <Segment key={i} i={i} />
            ))}
          </div>
          <div className="flex animate-marquee" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <Segment key={i} i={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
