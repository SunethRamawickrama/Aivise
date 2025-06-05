"use client";

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";
import { Brain, CreditCard } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

import { dark } from "@clerk/themes";

function Navbar() {
  const { theme } = useTheme();

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <Link href="/space" className="flex items-center gap-2 text-[#ff8a33]">
          <Brain className="size-[35px]" />
          <span className="text-xl font-bold tracking-tight">Aivise</span>
        </Link>

        <nav>
          <ul className=" mx-auto max-w-7xl flex items-center px-4 pr-20 py-4 gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
            <li>
              <Link href="/upload">Upload</Link>
            </li>
            <li>
              <Link href="/roadmap">Courses</Link>
            </li>
            <li>
              <Link href="/schedule">Schedule</Link>
            </li>
            <li>
              <Link href="/campustool">Campus Tool</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
