import CursorSVG from "@/public/assets/CursorSVG";
import { CursorChatProps, CursorMode } from "@/types/type";
import React from "react";

const CursorChat = ({
  cursorState,
  setCursorState,
  updateMyPresence,
  cursor,
}: CursorChatProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCursorState({
        mode: CursorMode.Chat,
        message: "",
        // @ts-ignore
        previousMessage: cursorState.message,
      });
    } else if (e.key === "Escape") {
      setCursorState({
        mode: CursorMode.Hidden,
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursorState({
      mode: CursorMode.Chat,
      message: e.target.value,
      previousMessage: null,
    });
    updateMyPresence({
      message: e.target.value,
    });
  };
  return (
    <div
      className=" absolute top-0 left-0 "
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}>
      {cursorState.mode === CursorMode.Chat && (
        <>
          <CursorSVG color="#000" />
          <div className="absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white">
            <input
              className="z-10 w-60 border-none	bg-transparent text-white placeholder-blue-300 outline-none"
              autoFocus
              type="text"
              placeholder={
                cursorState.previousMessage ? "" : "Say something ..."
              }
              value={cursorState.message}
              maxLength={50}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CursorChat;
