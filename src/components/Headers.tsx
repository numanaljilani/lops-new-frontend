"use client"
import {
    CircleUser,
    Menu,
    Package2
} from "lucide-react"
import Link from "next/link"


import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useParams, usePathname, useRouter } from "next/navigation"

function Headers() {
  const path = usePathname();
  const router = useRouter()

  const logout = async ()=>{
    router.replace("/")
  }


  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50"> 
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <Link
        href="/dashboard"
        className={`${path.split("/")[1] != "dashboard"?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Dashboard
      </Link>
      <Link
        href="/rfqs"
        className={`${path.split("/")[1] != "rfqs" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        RFQ's
      </Link>
  
      <Link
        href="/projects"
        className={`${path.split("/")[1] != "projects" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Projects
      </Link>
      <Link
        href="/accounts"
        className={`${path.split("/")[1] != "accounts" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Accounts
      </Link>
      <Link
        href="/expenses"
        className={`${path.split("/")[1] != "expenses" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Expenses
      </Link>
      <Link
        href="/clients"
        className={`${path.split("/")[1] != "clients" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Clients
      </Link>
      
      <Link
        href="/employee"
        className={`${path.split("/")[1] != "employee" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Employee
      </Link>
      <Link
        href="/companies"
        className={`${path.split("/")[1] != "companies" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Companies
      </Link>
      <Link
        href="/timesheet"
        className={`${path.split("/")[1] != "projects" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Timecard
      </Link>
      <Link
        href="#"
        className={`${path.split("/")[1] != "projects" ?"text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
      >
        Analytics
      </Link>

    </nav>
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
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
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link href="#" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Orders
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Customers
          </Link>
          <Link
            href="/employee"
            className="text-muted-foreground hover:text-foreground"
          >
            Employee
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Analytics
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <form className="ml-auto flex-1 sm:flex-initial">
        {/* <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div> */}
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
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
  )
}

export default Headers