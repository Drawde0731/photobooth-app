"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function PrivacyModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
          Privacy Policy
        </span>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-white text-black">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-700">
            Snap &amp; Pose respects your privacy. Please read carefully:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>All photos and GIFs are generated entirely on your device.</li>
              <li>
                We do <strong>not</strong> collect, upload, or share your images.
              </li>
              <li>You have full control over downloading and sharing your media.</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
