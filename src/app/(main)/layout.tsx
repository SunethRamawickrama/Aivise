"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import Loader from "@/components/Loader";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";
import SpaceNavbar from "./_components/SpaceNavbar";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/");
  }

  return (
    <div className="h-screen flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto relative">
        <div className="absolute right-6 top-3 z-[99999]">
          <SpaceNavbar />
        </div>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
