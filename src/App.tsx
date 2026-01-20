import { useState, type ChangeEvent } from "react";
import GridBoard from "./GridBoard";

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [showGridBoard, setShowGridBoard] = useState<boolean>(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const reorderImages = (from: number, to: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const base64Images = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          }),
      ),
    );

    setImages((prev) => [...prev, ...base64Images]);
  };

  const deleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center m-3 gap-3">
      {!showGridBoard && (
        <label htmlFor="files-select" className="border-2 w-90 text-center">
          Enter Multiple Images ({images.length})/25
        </label>
      )}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        id="files-select"
        className="hidden"
      />
      {images.length >= 25 && (
        <button
          className="bg-blue-600 w-90 p-2 text-white rounded-3xl font-mono"
          onClick={() => setShowGridBoard(true)}
        >
          Generate Grid Board
        </button>
      )}
      {showGridBoard && (
        <button
          className=" w-90 p-2 border-2 rounded-3xl font-mono"
          onClick={() => setShowGridBoard(false)}
        >
          Edit Images
        </button>
      )}

      {!showGridBoard && (
        <div className="flex gap-1 w-2xl md:w-3xl lg:w-4xl flex-wrap">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 cursor-move"
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== index) {
                  reorderImages(dragIndex, index);
                }
                setDragIndex(null);
              }}
            >
              <img src={img} className="size-40 object-contain border" />
              <button
                className="border border-black text-red-500"
                onClick={() => deleteImage(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showGridBoard && <GridBoard images={images} />}
    </div>
  );
}
