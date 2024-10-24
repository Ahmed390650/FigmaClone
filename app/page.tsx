"use client";
import Live from "@/components/Live";
import RightSideBar from "@/components/RightSideBar";
import { useEffect, useRef, useState } from "react";
import { Canvas, Object } from "fabric";
import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from "@/lib/canvas";
import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";
import { ActiveElement } from "@/types/type";

export default function Home(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<Object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    icon: "",
    name: "",
    value: "",
  });
  const handleActiveElement = (ele: ActiveElement) => {
    setActiveElement(ele);
    selectedShapeRef.current = ele?.value as string;
  };
  useEffect(() => {
    const canvas = initializeFabric({ fabricRef, canvasRef });
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
      });
    });
    window.addEventListener("resize", () => {
      handleResize({ canvas: fabricRef.current });
    });
    return () => {
      canvas.dispose();
    };
  }, []);
  return (
    <main className='h-screen overflow-hidden'>
      <Navbar
        handleActiveElement={handleActiveElement}
        activeElement={activeElement}
      />
      <section className='flex h-full flex-row'>
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSideBar />
      </section>
    </main>
  );
}
