import React, { useRef } from "react";
import Dimensions from "./settings/Dimensions";
import Color from "./settings/Color";
import Export from "./settings/Export";
import Text from "./settings/Text";
import { RightSidebarProps } from "@/types/type";
import { modifyShape } from "@/lib/shapes";

const RightSideBar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);
  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;
    setElementAttributes((prev) => ({ ...prev, [property]: value }));
    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      activeObjectRef,
      property,
      syncShapeInStorage,
      value,
    });
  };
  return (
    <section className='sticky left-0 flex h-full min-w-[227px] select-none flex-col overflow-y-auto border-t border-primary-grey-200 bg-primary-black pb-20 text-primary-grey-300 max-sm:hidden'>
      <h3 className=' px-5 pt-4 text-xs uppercase'>Design</h3>
      <span className='mt-3 border-b border-primary-grey-200 px-5 pb-4 text-xs text-primary-grey-300'>
        Make changes to canvas as you like
      </span>
      <Dimensions
        height={elementAttributes.height}
        isEditingRef={isEditingRef}
        handleInputChange={handleInputChange}
        width={elementAttributes.width}
      />
      <Text
        fontFamily={elementAttributes.fontFamily}
        fontSize={elementAttributes.fontSize}
        fontWeight={elementAttributes.fontWeight}
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={colorInputRef}
        attribute={elementAttributes.fill}
        placeholder='color'
        attributeType='fill'
        handleInputChange={handleInputChange}
      />

      <Color
        inputRef={strokeInputRef}
        attribute={elementAttributes.stroke}
        placeholder='stroke'
        attributeType='stroke'
        handleInputChange={handleInputChange}
      />
      <Export />
    </section>
  );
};

export default RightSideBar;
