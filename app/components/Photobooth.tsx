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

  const handleRetry = () => {
    setGifs([]);
    setBitmaps([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
    <img src="/Snap&Posee.png" alt="Snap & Pose" className="w-24 h-24"/>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Snap & Pose</h1>
        <blockquote className="mb-4 italic text-xs text-gray-900">
            &quot;by drawde&quot;
        </blockquote>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        {gifs.length < 3 ? (
          <GifCapture onCapture={handleCapture} />
        ) : (
          <PhotoStrip bitmaps={bitmaps} gifs={gifs}  onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
};

export default Photobooth;
