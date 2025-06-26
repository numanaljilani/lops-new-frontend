"use client";

import { CircleUser, Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { hasCommon } from "@/utils/checkAccess";

function Headers() {
  const path = usePathname();
  const router = useRouter();
  const currentPath = path.split("/")[1]; // Store the current path segment

  const accesses = useSelector((state: any) => state?.user?.user?.access);
  // console.log(accesses, ">>>>>");

  const logout = async () => {
    router.replace("/");
  };

  // Define navigation links
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", access: ["admin", "sales"] },
    {
      href: "/rfqs",
      label: "RFQ's",
      access: ["admin", "sales"],
    },
    {
      href: "/projects",
      label: "Projects",
      access: ["admin", "team member", "Team Leads", "accounts", "sales"],
    },
    { href: "/accounts", label: "Accounts", access: ["admin", "accounts"] },
    { href: "/expenses", label: "Expenses", access: ["admin", "accounts"] },

    { href: "/clients", label: "Clients", access: ["admin"] },
    { href: "/employee", label: "Employee", access: ["admin"] },
    { href: "/companies", label: "Companies", access: ["admin"] },

    {
      href: "/timesheet",
      label: "Timecard",
      access: ["admin", "sales", "Team Lead", "team member", "accounts","subcontractor"],
    },
    // { href: "#", label: "Analytics" },
  ];

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      {/* Desktop Navigation */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">LOPS</span>
        </Link>
        {navLinks.map(
          (link: any) =>
            hasCommon(link?.access, accesses) && (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  currentPath !== link.href.split("/")[1]
                    ? "text-muted-foreground"
                    : "text-foreground"
                } transition-colors hover:text-foreground`}
              >
                {link.label}
              </Link>
            )
        )}
      </nav>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">LOPS</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  currentPath !== link.href.split("/")[1]
                    ? "text-muted-foreground"
                    : "text-foreground"
                } hover:text-foreground`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* User Menu */}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          {/* Search bar can be added here */}
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>router.push("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Headers;





// LETS-INV-1001
// JN2506001