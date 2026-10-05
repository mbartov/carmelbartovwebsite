"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ActionState } from "@/lib/content";

export default function ConfirmForm({
  id,
  action,
  label,
  confirm,
  className,
  icon,
}: {
  id: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  label: string;
  confirm?: string;
  className: string;
  icon?: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={className}
        aria-label={icon ? label : undefined}
        title={label}
        onClick={(event) => {
          event.stopPropagation();
          if (confirm && !window.confirm(confirm)) event.preventDefault();
        }}
      >
        {icon ?? label}
      </button>
      {state?.ok === false ? (
        <span className="mt-1 block text-xs text-pink-bright">{state.error}</span>
      ) : null}
    </form>
  );
}
