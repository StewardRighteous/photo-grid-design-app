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
        size: 228mm 329.6mm;
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
        className="w-90 rounded-3xl bg-blue-600 p-2 font-mono text-white"
        onClick={reactToPrintFn}
      >
        Print Board
      </button>
      {rotatedImages.length < 25 && <div className="loader"></div>}
      {rotatedImages.length >= 25 && (
        <div
          className="flex h-[329.6mm] w-[228mm] items-center justify-center border border-dashed"
          ref={contentRef}
        >
          <div className="relative flex h-[324.6mm] w-[223mm] items-center justify-center">
            <div className="absolute top-0 right-0 size-20 border-t-2 border-r-2"></div>
            <div className="absolute bottom-0 left-0 size-20 border-b-2 border-l-2"></div>
            <div className="absolute top-0 left-0 size-5 bg-black"></div>
            <div className="grid grid-cols-5 gap-[2.5mm]">
              {rotatedImages.map((img, index) => (
                <div
                  key={index}
                  className="relative flex h-[53mm] w-[37.75mm] flex-col items-center justify-center overflow-hidden"
                >
                  <img
                    src={img}
                    className="absolute inset-0 h-full w-full object-cover blur-sm"
                  />
                  <img
                    src={img}
                    className="relative h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
