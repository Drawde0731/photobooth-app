import GIF from "gif.js";

export const createGifInstance = (
  width: number,
  height: number,
  workerScript: string = "/gif.worker.js"
) => {
  return new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
    workerScript,
  });
};

export const renderGif = (gif: GIF): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    gif.on("finished", (blob: Blob) => {
      if (!blob) reject("Failed to render GIF");
      else resolve(blob);
    });
    gif.render();
  });
};

