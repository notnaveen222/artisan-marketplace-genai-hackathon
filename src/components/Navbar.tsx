"use client";

import RouterButton from "./router-button";

export default function Navbar() {
  return (
    <div className="w-screen h-16 border-b border-b-black/50 px-7 flex items-center justify-between">
      <div
        className="font-semibold  text-xl
      "
      >
        ArtisanAI
      </div>
      <div className="flex justify-between gap-x-5 font-medium ">
        <RouterButton title="Home" route="/" />
        <RouterButton title="Dashboard" route="/dashboard" />
        <RouterButton title="Marketplace" route="/marketplace" />
      </div>
    </div>
  );
}
