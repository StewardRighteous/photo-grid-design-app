import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import { rotateImage } from "./utils/rotateImage";

type GridBoardProps = {
  images: string[];
};

export default function GridBoard({ images }: GridBoardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [rotatedImages, setRotatedImages] = useState<string[]>([]);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "photo-grid",
    pageStyle: `
      @page {
        size: 224mm 324mm;
        margin: 0;
      }
    `,
  });

  useEffect(() => {
    if (!images.length) return;

    let cancelled = false;

    async function rotateAll() {
      const result = await Promise.all(
        images.map((img) => rotateImage(img, { angle: 270 })),
      );

      if (!cancelled) {
        setRotatedImages(result as string[]);
      }
    }

    rotateAll();

    return () => {
      cancelled = true;
    };
  }, [images]);

  return (
    <>
      <button
        className="bg-blue-600 w-90 p-2 text-white rounded-3xl font-mono"
        onClick={reactToPrintFn}
      >
        Print Board
      </button>
      {rotatedImages.length < 25 && <div className="loader"></div>}
      {rotatedImages.length >= 25 && (
        <div
          className="flex h-[324.6mm] w-[223mm] border-[1pt] justify-center items-center relative"
          ref={contentRef}
        >
          <div className="size-3 bg-black absolute left-1 top-1 "></div>
          <div className="grid grid-cols-5 gap-[2.5mm]">
            {rotatedImages.map((img, index) => (
              <div key={index} className="flex flex-col justify-center">
                <img
                  src={img}
                  className="object-contain relative z-1 w-[37.75mm] h-[53mm]"
                />
                <img
                  src={img}
                  className=" blur-sm absolute z-0 w-[37.75mm] h-[53mm]"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
