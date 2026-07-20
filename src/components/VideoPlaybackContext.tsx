"use client";

import { createContext, useContext, useMemo, useState } from "react";

type VideoPlaybackContextValue = {
  activeId: string | null;
  play: (id: string) => void;
  stop: (id: string) => void;
};

const VideoPlaybackContext = createContext<VideoPlaybackContextValue | null>(
  null
);

export function VideoPlaybackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      activeId,
      play: (id: string) => setActiveId(id),
      stop: (id: string) =>
        setActiveId((current) => (current === id ? null : current)),
    }),
    [activeId]
  );

  return (
    <VideoPlaybackContext.Provider value={value}>
      {children}
    </VideoPlaybackContext.Provider>
  );
}

export function useVideoPlayback() {
  const ctx = useContext(VideoPlaybackContext);
  if (!ctx) {
    throw new Error(
      "useVideoPlayback must be used within a VideoPlaybackProvider"
    );
  }
  return ctx;
}
