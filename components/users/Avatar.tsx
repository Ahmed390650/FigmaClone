import React from "react";
import styles from "./index.module.css";
import Image from "next/image";
const IMAGE_SIZE = 48;

export function Avatar({
  otherStyles,
  name,
}: {
  otherStyles: string;
  name: string;
}) {
  return (
    <div
      className={`relative h-9 w-9 rounded-full ${otherStyles}`}
      data-tooltip={name}>
      <Image
        src={`https://liveblocks.io/avatars/avatar-${Math.floor(
          Math.random() * 30
        )}.png`}
        fill
        className="rounded-full"
        alt={name}
      />
    </div>
  );
}
