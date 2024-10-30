"use client";
import Live from "@/components/Live";
import RightSideBar from "@/components/RightSideBar";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleResize,
  handlePathCreated,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";
import { ActiveElement, Attributes } from "@/types/type";
import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";

export default function Home(): JSX.Element {
  const undo = useUndo();
  const redo = useRedo();
  const canvasObjects = useStorage((root) => root.canvasObjects);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef<boolean>(false);
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    icon: "",
    name: "",
    value: "",
  });
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    fill: "",
    fontFamily: "",
    fontSize: "",
    fontWeight: "",
    height: "",
    stroke: "",
    width: "",
  });
  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObject = storage.get("canvasObjects");
    canvasObject.delete(shapeId);
  }, []);
  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) return true;
    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }

    // return true if the store is empty
    return canvasObjects.size === 0;
  }, []);
  const syncShapeInStorage = useMutation(({ storage }, object) => {
    // if the passed object is null, return
    if (!object) return;
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(objectId, shapeData);
  }, []);
  const handleActiveElement = (ele: ActiveElement) => {
    setActiveElement(ele);
    selectedShapeRef.current = ele?.value as string;
    switch (ele?.value) {
      case "reset":
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;
      case "delete":
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        setActiveElement(defaultNavElement);
        break;
      case "image":
        imageInputRef?.current?.click();
        isDrawing.current = false;
        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;
    }
  };

  useEffect(() => {
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    canvas.on("mouse:down", (options: any) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });
    canvas.on("mouse:move", (options: any) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    });
    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });
    canvas.on("object:modified", (options: any) => {
      handleCanvasObjectModified({
        syncShapeInStorage,
        options,
      });
    });
    canvas.on("selection:created", (options: any) => {
      handleCanvasSelectionCreated({
        isEditingRef,
        options,
        setElementAttributes,
      });
    });
    canvas.on("object:scaling", (options: any) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });
    canvas.on("path:created", (options: any) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    });
    window.addEventListener("keydown", (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })
    );
    return () => {
      canvas.dispose();
      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });
      window.removeEventListener("keydown", (e) =>
        handleKeyDown({
          e,
          canvas: fabricRef.current,
          undo,
          redo,
          syncShapeInStorage,
          deleteShapeFromStorage,
        })
      );
    };
  }, [canvasRef]);
  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  return (
    <main className='h-screen overflow-hidden'>
      <Navbar
        imageInputRef={imageInputRef}
        handleActiveElement={handleActiveElement}
        activeElement={activeElement}
        handleImageUpload={(e: any) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          });
        }}
      />
      <section className='flex h-full flex-row'>
        <LeftSidebar allShapes={Array.from(canvasObjects || [])} />
        <Live canvasRef={canvasRef} undo={undo} redo={redo} />
        <RightSideBar
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          elementAttributes={elementAttributes}
          fabricRef={fabricRef}
          setElementAttributes={setElementAttributes}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </main>
  );
}
