import { parseGIF, decompressFrames } from "gifuct-js";
import { createGifInstance, renderGif } from "./gifUtils";

export async function mergeGifsIntoStrip(
  gifUrls: string[],
  width = 300,
  height = 200
) {
  const padding = 16;
  const gap = 8;

  // Load and decode each GIF
  const gifs = await Promise.all(
    gifUrls.map(async (url) => {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const gif = parseGIF(buf);
      return decompressFrames(gif, true);
    })
  );

  const maxFrames = Math.max(...gifs.map((frames) => frames.length));

  // Full strip dimensions including padding/gap
  const stripWidth = width + padding * 2;
  const stripHeight =
    gifUrls.length * height + (gifUrls.length - 1) * gap + padding * 2;

  // Create gif.js encoder
  const gif = createGifInstance(stripWidth, stripHeight);

  // For each GIF, maintain its "previous full frame"
  const fullFrameBuffers = gifs.map(() => null as ImageData | null);

  for (let f = 0; f < maxFrames; f++) {
    const stripCanvas = document.createElement("canvas");
    stripCanvas.width = stripWidth;
    stripCanvas.height = stripHeight;
    const ctx = stripCanvas.getContext("2d")!;

    // White background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    gifs.forEach((frames, i) => {
      const frame = frames[f % frames.length];

      // Create buffer canvas to hold full frame
      const bufferCanvas = document.createElement("canvas");
      bufferCanvas.width = frame.dims.width;
      bufferCanvas.height = frame.dims.height;
      const bctx = bufferCanvas.getContext("2d")!;

      // If we have a previous full frame, draw it first
      if (fullFrameBuffers[i]) {
        bctx.putImageData(fullFrameBuffers[i]!, 0, 0);
      }

      // Draw patch of current frame on top
      const patch = new ImageData(
        new Uint8ClampedArray(frame.patch),
        frame.dims.width,
        frame.dims.height
      );
      bctx.putImageData(patch, frame.dims.left, frame.dims.top);

      // Save updated full frame back into buffer
      fullFrameBuffers[i] = bctx.getImageData(
        0,
        0,
        bufferCanvas.width,
        bufferCanvas.height
      );

      // Position with padding + gap
      const y = padding + i * (height + gap);

      // Finally, draw scaled full frame into strip slot
      ctx.drawImage(bufferCanvas, padding, y, width, height);

      // Border
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.strokeRect(padding, y, width, height);
    });

    gif.addFrame(stripCanvas, { delay: 100 });
  }

  const blob = await renderGif(gif);
  return URL.createObjectURL(blob);
}
