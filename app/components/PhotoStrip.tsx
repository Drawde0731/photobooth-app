"use client";
import React, { useState, useEffect } from "react";
import { combineIntoStrip, canvasToBlobUrl } from "../utils/canvasUtils";
import { mergeGifsIntoStrip } from "../utils/gifMerge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type Props = {
  bitmaps: ImageBitmap[];
  gifs: string[];
  onRetry: () => void;
};

const PhotoStrip: React.FC<Props> = ({ bitmaps, gifs, onRetry  }) => {
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

  /** ✅ Animated GIF Export */
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


  useEffect(() => {
    if (bitmaps.length > 0) {
      createStripImage(); 
    }
  }, [bitmaps]);

  const formatDateTime = (date: Date) => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}-${min}-${ss}_${mm}-${dd}-${yyyy}`;
};

const fileName = `Photobooth_by_Drawde_${formatDateTime(new Date())}.${fileType}`;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
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
      {stripUrl && (
        <div className="mt-5 flex flex-col items-center gap-3">
          <img
            src={stripUrl}
            alt="Photo strip preview"
            className="rounded-lg shadow-md border"
          />
          <Button
            variant="link"
            asChild
            className="px-6 py-2 text-sm font-medium text-white"
            >
            <a href={stripUrl} download={fileName}>
                Download {fileType.toUpperCase()}
            </a>
        </Button>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Retry</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black text-white border border-gray-700">
                <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                    Are you sure you want to retry?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                    This action cannot be undone. This will permanently delete the
                    current photo strip and return you to the camera.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                    onClick={onRetry}
                    className="bg-red-600 text-white hover:bg-red-700"
                >
                    Yes, retry
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
            </div>
      )}
    </div>
  );
};

export default PhotoStrip;
