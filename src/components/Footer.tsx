import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t dark:border-gray-700">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-wrap justify-center gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className="text-gray-600 hover:text-[#ff8a33] dark:text-gray-300 dark:hover:text-[#ff8a33]"
            >
              Product
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className="text-gray-600 hover:text-[#ff8a33] dark:text-gray-300 dark:hover:text-[#ff8a33]"
            >
              Features
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className="text-gray-600 hover:text-[#ff8a33] dark:text-gray-300 dark:hover:text-[#ff8a33]"
            >
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className="text-gray-600 hover:text-[#ff8a33] dark:text-gray-300 dark:hover:text-[#ff8a33]"
            >
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
        © 2024 Aivise.ai. All rights reserved.
      </p>
    </footer>
  );
}
