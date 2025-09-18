"use client";
import React, { useState } from "react";
import { combineIntoStrip, canvasToBlobUrl } from "../utils/canvasUtils";
import { createGifInstance, renderGif } from "../utils/gifUtils";
import { mergeGifsIntoStrip } from "../utils/gifMerge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
type Props = {
  bitmaps: ImageBitmap[]; // still used for static strip
  gifs: string[];
};

const PhotoStrip: React.FC<Props> = ({ bitmaps, gifs }) => {
  const [stripUrl, setStripUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState<"png" | "gif">("png");

  /** ✅ Static Image Export */
  const createStripImage = async () => {
    setLoading(true);
    setFileType("png");
    try {
      const canvas = await combineIntoStrip(bitmaps, 300, 200);
      const url = await canvasToBlobUrl(canvas);
      setStripUrl(url);
    } finally {
      setLoading(false);
    }
  };

const createStripGif = async () => {
  setLoading(true);
  setFileType("gif");
  try {
    const url = await mergeGifsIntoStrip(gifs, 300, 200);
    setStripUrl(url);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>

    {/* 📥 Export buttons */}
    <div className="mt-5 flex justify-center">
    <ToggleGroup
        type="single"
        value={fileType}
        onValueChange={async (val) => {
        if (!val) return;
        if (val === "png") {
            await createStripImage();
        } else if (val === "gif") {
            await createStripGif();
        }
        }}
        className="bg-gray-100 rounded-lg p-1 shadow"
    >
        <ToggleGroupItem
        value="png"
        className="px-4 py-2 text-sm font-medium rounded-md text-gray-500 data-[state=on]:bg-black data-[state=on]:text-white"
        disabled={loading}
        >
        {loading && fileType === "png" ? "Processing..." : "Image"}
        </ToggleGroupItem>
        <ToggleGroupItem
        value="gif"
        className="px-4 py-2 text-sm font-medium rounded-md text-gray-500  data-[state=on]:bg-black data-[state=on]:text-white"
        disabled={loading || gifs.length === 0}
        >
        {loading && fileType === "gif" ? "Processing..." : "GIF"}
        </ToggleGroupItem>
    </ToggleGroup>
    </div>

      {/* ✅ Download preview */}
        {stripUrl && (
        <div className="mt-5 flex flex-col items-center gap-3">
            <img
            src={stripUrl}
            alt="Photo strip preview"
            className="rounded-lg shadow-md border"
            />
            <Button variant="link" asChild className="px-6 py-2 text-sm font-medium text-white">
            <a href={stripUrl} download={`strip.${fileType}`}>
                Download {fileType.toUpperCase()}
            </a>
            </Button>
        </div>
        )}
    </div>
  );
};

export default PhotoStrip;
