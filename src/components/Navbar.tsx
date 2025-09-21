"use client";

import { Palette } from "lucide-react";
import RouterButton from "./router-button";

export default function Navbar() {
  return (
    <div className="w-screen h-16 border-b border-b-black/50 px-7 flex items-center justify-between">
      <div className="flex gap-x-2 items-center">
        <div className="w-8 h-8 bg-primary/80 rounded-xl flex items-center justify-center">
          <Palette className="w-6 h-6 text-white" />
        </div>
        <div className="font-semibold  text-xl">ArtisanAI</div>
      </div>
      <div className="flex justify-between gap-x-5 font-medium ">
        <RouterButton title="Home" route="/" />
        <RouterButton title="Dashboard" route="/dashboard" />
        <RouterButton title="Marketplace" route="/marketplace" />
      </div>
    </div>
  );
}
