"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/admin/Dashboard";
import NonAdminDasboard from "@/components/admin/NonAdminDasboard";
import { adminAndAccountsAndSalesCanAccess } from "@/utils/accessArrays";
import { hasCommon } from "@/utils/checkAccess";
import { useSelector } from "react-redux";

const description: string =
  "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.";

export default function Dashboard02() {
  const [view, setView] = useState<"admin" | "nonadmin">("nonadmin");
  const accesses = useSelector((state: any) => state?.user?.user?.access);
  return (
    <div className="space-y-4 p-4">
      { hasCommon(adminAndAccountsAndSalesCanAccess , accesses) && <div className="flex gap-2">
        <Button
          variant={view === "admin" ? "default" : "outline"}
          onClick={() => setView("admin")}
        >
          Admin Dashboard
        </Button>
        <Button
          variant={view === "nonadmin" ? "default" : "outline"}
          onClick={() => setView("nonadmin")}
        >
          Non-Admin Dashboard
        </Button>
      </div>}

      <div className="mt-4">
        {view === "admin" ? <Dashboard /> : <NonAdminDasboard />}
      </div>
    </div>
  );
}
