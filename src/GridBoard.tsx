type GridBoardProps = {
  images: string[];
};

export default function GridBoard({ images }: GridBoardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="size-3 bg-black "></div>
      <div className="grid grid-cols-5">
        {images.map((img, index) => (
          <div key={index} className="flex flex-col">
            <img
              src={img}
              className="object-contain relative z-1  h-[37.75mm] w-[53mm]"
            />
            <img
              src={img}
              className="blur-sm absolute z-0  h-[37.75mm] w-[53mm]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
