"use client";

import dynamic from "next/dynamic";

const Badge3D = dynamic(() => import("./Badge3D"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto h-[440px] w-full max-w-sm animate-pulse rounded-3xl bg-ink/10 sm:h-[520px]" />
  ),
});

export default Badge3D;
