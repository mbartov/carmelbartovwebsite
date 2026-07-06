const tags = [
  "Video editing",
  "Content creation",
  "Post-production",
  "Color grading",
  "Sound design",
];

export default function Ticker() {
  const track = tags.map((t) => `[${t}]`).join(" ");

  return (
    <div className="overflow-hidden whitespace-nowrap bg-purple py-2">
      <div className="inline-block animate-marquee font-display text-2xl uppercase text-cream sm:text-3xl">
        <span className="mx-6">{track}</span>
        <span className="mx-6">{track}</span>
        <span className="mx-6">{track}</span>
        <span className="mx-6">{track}</span>
      </div>
    </div>
  );
}
