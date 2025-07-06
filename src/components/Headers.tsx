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
import { useSelector, useDispatch } from "react-redux";
import { hasCommon } from "@/utils/checkAccess";
import { setSelectedCompany } from "@/redux/slice/profileSlice"; // Adjust path to your Redux slice
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

function Headers() {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPath = path.split("/")[1]; // Store the current path segment

  const accesses = useSelector((state: any) => state?.user?.user?.access || []);
  const companies = useSelector((state: any) => state?.user?.user?.company || []);
  const selectedCompany = useSelector((state: any) => state?.user?.selectedCompany || null);

  const logout = async () => {
    router.replace("/");
  };

  const handleCompanySelect = (company: { _id: string; name: string }) => {
    dispatch(setSelectedCompany(company));
     toast.success("Company switched", {
            description: `You have loged in  ${company.name}  successfully.`,
            style: { backgroundColor: "#d4edda" , borderColor : "#d4edda" , color : 'green' },
          });
    // console.log("Selected Company:", JSON.stringify(company, null, 2));
  };

  // Define navigation links
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", access: ["admin", "sales"] },
    { href: "/rfqs", label: "RFQ's", access: ["admin", "sales"] },
    {
      href: "/projects",
      label: "Projects",
      access: ["admin", "team member", "team leads", "accounts", "sales"],
    },
    { href: "/accounts", label: "Accounts", access: ["admin", "accounts"] },
    { href: "/expenses", label: "Expenses", access: ["admin", "accounts", "team leads"] },
    { href: "/clients", label: "Clients", access: ["admin", "sales"] },
    { href: "/employee", label: "Employee", access: ["admin"] },
    { href: "/companies", label: "Companies", access: ["admin"] },
    {
      href: "/timesheet",
      label: "Timecard",
      access: ["admin", "sales", "team leads", "team member", "accounts", "subcontractor"],
    },
  ];

  // Get selected company name(s) for display
  const selectedCompanyName = Array.isArray(selectedCompany)
    ? selectedCompany.map((c: any) => c.name).join(", ")
    : selectedCompany?.name || "Select Company";

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white shadow-sm px-4 sm:px-6 z-50">
      {/* Desktop Navigation */}
      <Toaster richColors position="top-right" />
      <nav className="hidden flex-col gap-6 text-sm font-medium text-gray-800 md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold text-gray-800"
        >
          <Package2 className="h-6 w-6 text-blue-600" />
          <span className="sr-only">LOPS</span>
        </Link>
        {navLinks.map(
          (link) =>
            hasCommon(link.access, accesses) && (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  currentPath === link.href.split("/")[1]
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                } transition-colors text-sm font-medium`}
              >
                {link.label}
              </Link>
            )
        )}
      </nav>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white p-4">
          <nav className="grid gap-4 text-sm font-medium text-gray-800">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold text-gray-800"
            >
              <Package2 className="h-6 w-6 text-blue-600" />
              <span className="sr-only">LOPS</span>
            </Link>
            {navLinks.map(
              (link) =>
                hasCommon(link.access, accesses) && (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      currentPath === link.href.split("/")[1]
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } text-sm font-medium`}
                  >
                    {link.label}
                  </Link>
                )
            )}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Right Side: Company Dropdown and User Menu */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Company Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8 w-full sm:w-auto max-w-[200px] border-gray-300 rounded-lg text-sm text-gray-800 hover:bg-gray-100 truncate"
            >
              {selectedCompanyName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-300 rounded-lg shadow-lg">
            <DropdownMenuLabel className="text-sm text-gray-600">Select Company</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {companies.length > 0 ? (
              companies.map((company: { _id: string; name: string }) => (
                <DropdownMenuItem
                  key={company._id}
                  onClick={() => handleCompanySelect(company)}
                  className="text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                >
                  {company.name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="text-sm text-gray-600">No companies available</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-300 rounded-lg shadow-lg">
            <DropdownMenuLabel className="text-sm text-gray-600">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="text-sm text-gray-800 hover:bg-gray-100"
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-gray-800 hover:bg-gray-100">
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Headers;