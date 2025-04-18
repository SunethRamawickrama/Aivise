import ThemeToggle from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { CreditCard } from "lucide-react";
import React from "react";
import { useTheme } from "next-themes";

function SpaceNavbar() {
  const { theme } = useTheme();

  return (
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
  );
}

export default SpaceNavbar;
