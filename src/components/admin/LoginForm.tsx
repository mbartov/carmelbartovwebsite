"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/login/actions";
import { fieldClass, primaryButton } from "./styles";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="mx-auto max-w-md">
      <p className="mb-3 text-sm text-cream/60">[ ניהול ]</p>
      <h1 className="font-display text-5xl leading-none">מילת כניסה</h1>
      <p className="mt-4 text-sm leading-relaxed text-cream/70">
        המילה שמורה בשרת. הדפדפן שומר רק סשן חתום אחרי שהיא נבדקת.
      </p>
      <label className="mt-8 block text-xs text-cream/60">
        מילת כניסה
        <input
          name="passphrase"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          dir="ltr"
          className={fieldClass}
        />
      </label>
      {state?.ok === false ? (
        <p className="mt-3 text-sm text-pink-bright" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className={`${primaryButton} mt-6`} disabled={pending}>
        {pending ? "בודקת…" : "כניסה"}
      </button>
    </form>
  );
}
