export async function combineIntoStrip(
  bitmaps: ImageBitmap[],
  width: number,
  height: number
) {
  const padding = 16; // same as p-4
  const gap = 8; // gap-2
  const totalHeight = bitmaps.length * height + (bitmaps.length - 1) * gap + padding * 2;

  const canvas = document.createElement("canvas");
  canvas.width = width + padding * 2;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d")!;


  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Loop images
  bitmaps.forEach((bitmap, i) => {
    const y = padding + i * (height + gap);

    // Draw image
    ctx.drawImage(bitmap, padding, y, width, height);

 
    ctx.strokeStyle = "#e5e7eb"; 
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, y, width, height);
  });

  return canvas;
}


export const canvasToBlobUrl = (canvas: HTMLCanvasElement): Promise<string> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(URL.createObjectURL(blob));
    });
  });
};
