type RotateImageOptions = {
  angle: number; // degrees
  outputType?: "base64" | "blob";
  mimeType?: string; // "image/png", "image/jpeg"
  quality?: number; // 0–1 (for jpeg/webp)
};

export async function rotateImage(
  src: string | Blob,
  {
    angle,
    outputType = "base64",
    mimeType = "image/png",
    quality = 1,
  }: RotateImageOptions,
): Promise<string | Blob> {
  const image = await loadImage(src);

  const radians = (angle * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  const width = image.width;
  const height = image.height;

  // calculate new bounding box
  const newWidth = Math.round(width * cos + height * sin);
  const newHeight = Math.round(width * sin + height * cos);

  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -width / 2, -height / 2);

  if (outputType === "blob") {
    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob!), mimeType, quality),
    );
  }

  return canvas.toDataURL(mimeType, quality);
}

function loadImage(src: string | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;

    if (src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
  });
}
