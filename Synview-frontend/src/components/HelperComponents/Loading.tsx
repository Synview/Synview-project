import React from "react";
import { LoadingOverlay } from "@mantine/core";
export default function Loading() {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-stone-950">
      <LoadingOverlay
        visible
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2, color: "#1c1917" }}
        loaderProps={{ color: "white", type: "bars", size: "xl" }}
      />
    </div>
  );
}
