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
          <span className="text-xl font-bold tracking-tight">Aivise.AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
