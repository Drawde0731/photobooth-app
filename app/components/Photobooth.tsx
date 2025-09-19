"use client";
import React, { useState } from "react";
import GifCapture from "./GifCapture";
import PhotoStrip from "./PhotoStrip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";

const Photobooth: React.FC = () => {
  const [gifs, setGifs] = useState<string[]>([]);
  const [bitmaps, setBitmaps] = useState<ImageBitmap[]>([]);
  const [openInstructions, setOpenInstructions] = useState<boolean>(true);

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
      {/* Logo as modal trigger */}
      <Dialog open={openInstructions} onOpenChange={setOpenInstructions}>
        <DialogTrigger asChild>
          <img
            src="/Snap&Posee.png"
            alt="Snap & Pose"
            className="w-24 h-24 cursor-pointer hover:opacity-80 transition-opacity"
            title="Click for instructions"
          />
        </DialogTrigger>
        <DialogContent className="bg-black text-white">
          <DialogHeader>
            <DialogTitle>How Snap & Pose works:</DialogTitle>
            <ol className="list-decimal list-inside pt-4 space-y-1 text-sm">
              <li>Prepare yourself in front of the camera.</li>
              <li>Take <strong>3 shots</strong> to capture your best moments.</li>
              <li>After the 3rd shot, your GIF & photo strip will appear.</li>
              <li>If you want to try again, click <strong>Retry</strong>.</li>
              <li>Have fun and strike a pose! 📸</li>
            </ol>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mt-4">
        Snap & Pose
      </h1>
      <blockquote className="mb-4 italic text-xs text-gray-900">&quot;by drawde&quot;</blockquote>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        {gifs.length < 3 ? (
          <GifCapture onCapture={handleCapture} />
        ) : (
          <PhotoStrip bitmaps={bitmaps} gifs={gifs} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
};

export default Photobooth;
