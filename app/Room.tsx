"use client";
import Loader from "@/components/Loader";
import { LiveMap } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider publicApiKey={process.env.PUBLIC_KEY} throttle={16}>
      <RoomProvider
        id='my-room'
        initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
        initialStorage={{ canvasObjects: new LiveMap([]) }}
      >
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
