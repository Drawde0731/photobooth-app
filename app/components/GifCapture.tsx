"use client";
import React, { useRef, useState, useEffect } from "react";
import { createGifInstance, renderGif } from "../utils/gifUtils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  onCapture: (gifUrl: string, imageBitmap: ImageBitmap) => void;
  totalFrames?: number;
  frameInterval?: number;
};

const GifCapture: React.FC<Props> = ({
  onCapture,
  totalFrames = 10,
  frameInterval = 100,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("🚨 Webcam error:", error);
      }
    };
    startWebcam();
  }, []);

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(timer);
        setCountdown(null);
        triggerCapture();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const triggerCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const width = 640; // camera width
    const height = (video.videoHeight / video.videoWidth) * width || 400;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = width;
    canvas.height = height;

    const gif = createGifInstance(width, height);
    let frameCount = 0;
    setIsProcessing(true);

    const captureFrame = () => {
      ctx.drawImage(video, 0, 0, width, height);
      gif.addFrame(canvas, { delay: frameInterval, copy: true });
      frameCount++;
      if (frameCount < totalFrames) {
        setTimeout(captureFrame, frameInterval);
      } else {
        renderGif(gif).then(async (blob) => {
          const gifUrl = URL.createObjectURL(blob);
          const bitmap = await createImageBitmap(canvas);
          onCapture(gifUrl, bitmap);
          setIsProcessing(false);
        });
      }
    };

    captureFrame();
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Camera */}
      <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden border-4 border-gray-700 shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Overlay crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-32 h-32 border-2 border-white/50 rounded-full" />
          <div className="absolute w-px h-20 bg-white/40" />
          <div className="absolute h-px w-20 bg-white/40" />
        </div>

        {/* Countdown overlay */}
        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-7xl font-extrabold">
            {countdown}
          </div>
        )}

        {/* Flash effect */}
        {flash && <div className="absolute inset-0 bg-white animate-pulse" />}
      </div>

      {/* Capture Button */}
      {/* Capture Button */}
<Button
  onClick={startCountdown}
  disabled={isProcessing}
  className="mt-6 px-8 py-6 text-lg rounded-full bg-black text-white shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isProcessing ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin" />
      Processing...
    </div>
  ) : (
    "Capture"
  )}
</Button>
    </div>
  );
};

export default GifCapture;
