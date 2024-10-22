import { LiveCursorProps } from "@/types/type";
import React from "react";
import Cursor from "./Cursor";
import { COLORS } from "@/constants";

const LiveCursors = ({ others }: LiveCursorProps) => {
  return others.map(({ presence, connectionId }) => {
    if (!presence?.cursor) return null;
    const { x, y } = presence.cursor;
    return (
      <Cursor
        key={connectionId}
        x={x}
        y={y}
        message={presence.message}
        color={COLORS[Number(connectionId) % COLORS.length]}
      />
    );
  });
};

export default LiveCursors;
