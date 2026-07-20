export default function NameBanner() {
  return (
    // Always LTR + Anton: page RTL + Rubik made "CARMEL BARTOV" overflow and clip on the left
    <div className="overflow-hidden bg-pink py-2" dir="ltr">
      <div className="whitespace-nowrap text-center font-[family-name:var(--font-anton)] text-[min(16vw,calc(100vw/6.3))] leading-none text-ink">
        CARMEL BARTOV
      </div>
    </div>
  );
}
