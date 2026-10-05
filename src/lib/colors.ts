export const CARD_COLORS = ["pink", "green", "orange", "purple", "blue"] as const;

export type CardColor = (typeof CARD_COLORS)[number];

export const colorMap: Record<CardColor, string> = {
  pink: "bg-pink-bright",
  green: "bg-green",
  orange: "bg-orange",
  purple: "bg-purple",
  blue: "bg-blue",
};

export const colorBorder: Record<CardColor, string> = {
  pink: "border-pink-bright",
  green: "border-green",
  orange: "border-orange",
  purple: "border-purple",
  blue: "border-blue",
};

export const colorLabel: Record<CardColor, string> = {
  pink: "ורוד",
  green: "ירוק",
  orange: "כתום",
  purple: "סגול",
  blue: "כחול",
};

export function isCardColor(value: string): value is CardColor {
  return (CARD_COLORS as readonly string[]).includes(value);
}
