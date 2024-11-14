"use client";

import Navigation from "./_components/nav";

export default function Home() {
  return (
    <div className="h-screen" id="firstFold">
      <Navigation />
      <div className="flex w-full items-center px-10 h-full">
        <p className="text-center">
          This is a NextJS environment that I can tool around with random
          backend and frontend concepts with without committing to making it
          look good
        </p>
      </div>
    </div>
  );
}
