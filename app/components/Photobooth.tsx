"use client";
import React, { useState } from "react";
import GifCapture from "./GifCapture";
import PhotoStrip from "./PhotoStrip";

const Photobooth: React.FC = () => {
  const [gifs, setGifs] = useState<string[]>([]);
  const [bitmaps, setBitmaps] = useState<ImageBitmap[]>([]);

const handleCapture = (gifUrl: string, bitmap: ImageBitmap) => {
  setGifs((prev) => {
    if (prev.length >= 3) return prev; 
    return [...prev, gifUrl];
  });
  setBitmaps((prev) => {
    if (prev.length >= 3) return prev;
    return [...prev, bitmap];
  });
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h2 className="text-3xl font-bold mb-6">📸 Photobooth</h2>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        {gifs.length < 3 ? (
          <GifCapture onCapture={handleCapture} />
        ) : (
          <PhotoStrip bitmaps={bitmaps} gifs={gifs} />
        )}
      </div>
    </div>
  );
};

export default Photobooth;
