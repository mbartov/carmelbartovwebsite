"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { ActionState } from "@/lib/content";

type DragState = {
  id: string;
  pointerId: number;
  offsetY: number;
  y: number;
  left: number;
  width: number;
  height: number;
};

type Props<T extends { id: string }> = {
  items: T[];
  persist: (ids: string[]) => Promise<ActionState>;
  render: (item: T) => React.ReactNode;
  itemClassName?: string | ((item: T) => string);
};

const defaultItemClassName =
  "flex items-start gap-3 rounded-2xl border border-cream/15 bg-cream/5 p-3";

export default function ReorderList<T extends { id: string }>({
  items: incoming,
  persist,
  render,
  itemClassName = defaultItemClassName,
}: Props<T>) {
  const [items, setItems] = useState(incoming);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef(incoming);
  const dragRef = useRef<DragState | null>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const savedKey = useRef(incoming.map((item) => item.id).join(","));
  const savedItems = useRef(incoming);
  const stopDrag = useRef<(() => void) | null>(null);
  const pendingOrder = useRef<T[] | null>(null);
  const saving = useRef(false);

  useEffect(
    () => () => {
      stopDrag.current?.();
      document.body.style.cursor = "";
    },
    [],
  );

  function indexFromPointer(pointerY: number, list: T[], dragId: string) {
    let index = 0;
    for (const item of list) {
      if (item.id === dragId) continue;
      const node = itemRefs.current.get(item.id);
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      if (pointerY > rect.top + rect.height / 2) index += 1;
    }
    return index;
  }

  function moveToPointer(clientY: number) {
    const currentDrag = dragRef.current;
    if (!currentDrag) return;
    const nextDrag = { ...currentDrag, y: clientY };
    dragRef.current = nextDrag;
    setDrag(nextDrag);

    const current = itemsRef.current;
    const from = current.findIndex((item) => item.id === currentDrag.id);
    const to = indexFromPointer(clientY, current, currentDrag.id);
    if (from === -1 || to === from) return;

    const next = current.slice();
    const [row] = next.splice(from, 1);
    if (!row) return;
    next.splice(to, 0, row);
    itemsRef.current = next;
    setItems(next);
  }

  function revertOrder() {
    const previous = savedItems.current;
    itemsRef.current = previous;
    setItems(previous);
  }

  async function commit(next: T[]) {
    pendingOrder.current = next;
    if (saving.current) return;
    saving.current = true;

    try {
      while (pendingOrder.current) {
        const batch = pendingOrder.current;
        pendingOrder.current = null;
        const ids = batch.map((item) => item.id);
        const key = ids.join(",");
        if (key === savedKey.current) continue;

        try {
          const result = await persist(ids);
          if (pendingOrder.current) continue;
          if (!result?.ok) {
            setError(result?.ok === false ? result.error : "לא ניתן לשמור את הסדר.");
            revertOrder();
            break;
          }
          savedKey.current = key;
          savedItems.current = batch;
          setError(null);
        } catch {
          if (pendingOrder.current) continue;
          setError("לא ניתן לשמור את הסדר.");
          revertOrder();
          break;
        }
      }
    } finally {
      saving.current = false;
    }
  }

  function finishDrag(pointerId: number) {
    const currentDrag = dragRef.current;
    if (!currentDrag || currentDrag.pointerId !== pointerId) return;
    stopDrag.current?.();
    stopDrag.current = null;
    dragRef.current = null;
    setDrag(null);
    document.body.style.cursor = "";
    void commit(itemsRef.current);
  }

  function onHandlePointerDown(event: React.PointerEvent<HTMLButtonElement>, id: string) {
    if (event.button !== 0 || dragRef.current) return;
    const node = itemRefs.current.get(id);
    if (!node) return;
    event.preventDefault();
    event.stopPropagation();

    const rect = node.getBoundingClientRect();
    const nextDrag: DragState = {
      id,
      pointerId: event.pointerId,
      offsetY: event.clientY - rect.top,
      y: event.clientY,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
    dragRef.current = nextDrag;
    setDrag(nextDrag);
    document.body.style.cursor = "grabbing";

    const onMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== nextDrag.pointerId) return;
      moveEvent.preventDefault();
      moveToPointer(moveEvent.clientY);
    };
    const onUp = (upEvent: PointerEvent) => finishDrag(upEvent.pointerId);
    window.addEventListener("pointermove", onMove, { capture: true });
    window.addEventListener("pointerup", onUp, { capture: true });
    window.addEventListener("pointercancel", onUp, { capture: true });
    stopDrag.current = () => {
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerup", onUp, { capture: true });
      window.removeEventListener("pointercancel", onUp, { capture: true });
    };
  }

  return (
    <div>
      {error ? <p className="mb-3 text-sm text-pink-bright">{error}</p> : null}
      <ul className={`m-0 flex list-none flex-col gap-3 p-0 ${drag ? "select-none" : ""}`}>
        {items.map((item) => {
          const isDragged = drag?.id === item.id;
          const frame =
            typeof itemClassName === "function" ? itemClassName(item) : itemClassName;
          return (
            <Fragment key={item.id}>
              {isDragged ? (
                <li
                  aria-hidden
                  className="shrink-0 rounded-2xl border border-dashed border-cream/30"
                  style={{ height: drag.height }}
                />
              ) : null}
              <li
                ref={(node) => {
                  if (node) itemRefs.current.set(item.id, node);
                  else itemRefs.current.delete(item.id);
                }}
                className={
                  isDragged ? `${frame} z-50 shadow-2xl shadow-black/40` : frame
                }
                style={
                  isDragged
                    ? {
                        position: "fixed",
                        top: drag.y - drag.offsetY,
                        left: drag.left,
                        width: drag.width,
                        pointerEvents: "none",
                      }
                    : undefined
                }
              >
                <button
                  type="button"
                  aria-label="גרירה לשינוי הסדר"
                  className="mt-1 cursor-grab touch-none rounded-lg px-1.5 py-2 text-cream/50 active:cursor-grabbing"
                  onPointerDown={(event) => onHandlePointerDown(event, item.id)}
                >
                  <GripIcon />
                </button>
                <div className="min-w-0 flex-1">{render(item)}</div>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}

function GripIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden fill="currentColor">
      <circle cx="4" cy="3" r="1.3" />
      <circle cx="10" cy="3" r="1.3" />
      <circle cx="4" cy="9" r="1.3" />
      <circle cx="10" cy="9" r="1.3" />
      <circle cx="4" cy="15" r="1.3" />
      <circle cx="10" cy="15" r="1.3" />
    </svg>
  );
}
