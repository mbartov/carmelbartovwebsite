"use client";

import { useActionState, useEffect } from "react";
import { CARD_COLORS, colorLabel, colorMap, type CardColor } from "@/lib/colors";
import type { ActionState, PortfolioItem, Testimonial } from "@/lib/content";
import { fieldClass, primaryButton, quietButton } from "./styles";

export function PortfolioForm({
  item,
  action,
  onDone,
}: {
  item?: PortfolioItem;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="mt-4 grid gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <Field label="קישור או מזהה יוטיוב" name="video" defaultValue={item?.videoId} dir="ltr" />
      <ColorField defaultValue={item?.color ?? "pink"} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="כותרת בעברית" name="titleHe" defaultValue={item?.titleHe} dir="rtl" />
        <Field label="כותרת באנגלית" name="titleEn" defaultValue={item?.titleEn} dir="ltr" />
      </div>
      <FormFooter pending={pending} error={state?.ok === false ? state.error : null} onCancel={onDone} editing={Boolean(item)} />
    </form>
  );
}

export function TestimonialForm({
  item,
  action,
  onDone,
}: {
  item?: Testimonial;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="mt-4 grid gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <ColorField defaultValue={item?.color ?? "pink"} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ציטוט בעברית" name="quoteHe" defaultValue={item?.quoteHe} multiline dir="rtl" />
        <Field label="ציטוט באנגלית" name="quoteEn" defaultValue={item?.quoteEn} multiline dir="ltr" />
        <Field label="שם בעברית" name="nameHe" defaultValue={item?.nameHe} dir="rtl" />
        <Field label="שם באנגלית" name="nameEn" defaultValue={item?.nameEn} dir="ltr" />
        <Field label="תפקיד בעברית" name="roleHe" defaultValue={item?.roleHe} dir="rtl" />
        <Field label="תפקיד באנגלית" name="roleEn" defaultValue={item?.roleEn} dir="ltr" />
      </div>
      <FormFooter pending={pending} error={state?.ok === false ? state.error : null} onCancel={onDone} editing={Boolean(item)} />
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  dir,
  multiline,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  dir?: "rtl" | "ltr";
  multiline?: boolean;
}) {
  return (
    <label className="block text-xs text-cream/60">
      {label}
      {multiline ? (
        <textarea
          name={name}
          required
          rows={4}
          dir={dir}
          defaultValue={defaultValue}
          className={fieldClass}
        />
      ) : (
        <input
          name={name}
          required
          dir={dir}
          defaultValue={defaultValue}
          className={fieldClass}
        />
      )}
    </label>
  );
}

function ColorField({ defaultValue }: { defaultValue: CardColor }) {
  return (
    <label className="block text-xs text-cream/60">
      צבע
      <select name="color" defaultValue={defaultValue} className={fieldClass}>
        {CARD_COLORS.map((color) => (
          <option key={color} value={color}>
            {colorLabel[color]}
          </option>
        ))}
      </select>
      <span className="mt-2 flex gap-2" aria-hidden>
        {CARD_COLORS.map((color) => (
          <span key={color} className={`h-3 w-3 rounded-full ${colorMap[color]}`} />
        ))}
      </span>
    </label>
  );
}

function FormFooter({
  pending,
  error,
  onCancel,
  editing,
}: {
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  editing: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="submit" className={primaryButton} disabled={pending}>
        {pending ? "שומרת…" : editing ? "שמירת שינויים" : "הוספה"}
      </button>
      <button type="button" className={quietButton} onClick={onCancel}>
        ביטול
      </button>
      {error ? <p className="text-sm text-pink-bright">{error}</p> : null}
    </div>
  );
}
