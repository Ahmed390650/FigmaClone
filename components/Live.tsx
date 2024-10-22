import { useMyPresence, useOthers } from "@liveblocks/react";
import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { CursorMode, CursorState } from "@/types/type";
import CursorChat from "./cursor/CursorChat";

const Live = (): React.JSX.Element => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const HandlePointerMove = useCallback((event: React.PointerEvent) => {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().x;
    updateMyPresence({
      cursor: {
        x,
        y,
      },
    });
  }, []);
  const HandlePointerDown = useCallback((event: React.PointerEvent) => {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().x;
    updateMyPresence({
      cursor: {
        x,
        y,
      },
    });
  }, []);
  const HandlePointerLeave = useCallback((event: React.PointerEvent) => {
    updateMyPresence({
      cursor: {
        x: null,
        y: null,
      },
    });
  }, []);
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          message: "",
          previousMessage: null,
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({
          mode: CursorMode.Hidden,
        });
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
    };
  }, [updateMyPresence]);
  return (
    <div
      onPointerDown={HandlePointerDown}
      onPointerLeave={HandlePointerLeave}
      onPointerMove={HandlePointerMove}
      className="h-[100vh] w-full flex justify-center items-center text-center ">
      <h1 className="text-5xl text-white">LiveBlocks Figma Clone</h1>
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
