"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { date, formatDate, timeFormat } from "@/lib/dateFormat";
import { useComponiesMutation, useDeleteCompanyMutation } from "@/redux/query/componiesApi";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import { useTimesheetMutation } from "@/redux/query/timesheet";


function TimeSheet() {
  const router = useRouter()
    const path = usePathname();
  const [timesheet, setTimeSheet] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const [timeSheetApi, { data, isSuccess, error, isError }] =
  useTimesheetMutation();
  const [deleteCompanyApi] = useDeleteCompanyMutation()

  const getTimeSheetData = async () => {
    const res = await timeSheetApi({});
    console.log(res, "response");
  };


  useEffect(() => {

      getTimeSheetData();
    
 
  }, []);


  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from server");
      if (data) {
        setTimeSheet(data.results);
      }
    }
  }, [isSuccess]);


  const deleteCompany = async(url : string) =>{
    console.log(url.split("/")[6])
    const res = await deleteCompanyApi({id : url.split("/")[6]})
    console.log(res , ">>>>")
    getTimeSheetData()
  }

  const update = async (url : string) =>{
    console.log(url.split("/").reverse()[1])
    router.push(`/timesheet/${url.split("/").reverse()[1]}`)
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              {/* <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Sales">Sales</TabsTrigger>
              <TabsTrigger value="Team Leads">Team Leads</TabsTrigger>
              <TabsTrigger value="Team Members">Team Members</TabsTrigger>
              <TabsTrigger value="Sub-Contractors">Sub-Contractors</TabsTrigger>
              <TabsTrigger value="Accounts">Accounts</TabsTrigger>
            </TabsList> */}
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Sales Member
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Team Leads
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Team Members
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Sub-Contractors
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Accounts Members
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Link href="/timesheet/create-timesheet">
                  <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Time & Logs</CardTitle>
                  <CardDescription>
                    Manage your Times and logs and view  performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                      
                        {/* <TableHead>Name</TableHead> */}
                        <TableHead>Date</TableHead>
                        <TableHead>In</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Out
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Hours Logged
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Amount
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Remark
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timesheet?.map((data : {date_logged : string , added_date : string , hours_logged : string , remarks : string , total_amount : string , url : string}, index : number) => {
                        return (
                          <TableRow key={index} className="cursor-pointer" onClick={()=> router.push(`/timesheet/${path?.split("/")?.reverse()[0]}`)}>
                            
                            <TableCell className="font-medium">
                            {date(data?.date_logged)}
                            </TableCell>
                            {/* <TableCell>
                              <Badge variant="outline">{data?.active ? "Active" : "Inactive"}</Badge>
                            </TableCell> */}
                            <TableCell>{data?.added_date ? timeFormat(data?.added_date ) : "-"}</TableCell>
                            <TableCell className="hidden md:table-cell">
                            {data?.added_date ? timeFormat(data?.added_date) : "-"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {data.hours_logged
}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {data.total_amount
}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {data.remarks}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={()=> update(data.url)}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={()=>{
                                  setItemToDelete(data);
                                    setIsDialogOpen(true)}}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={itemToDelete}
          deleteCompany={true}
        />
      </div>
    </div>
  );
}

export default TimeSheet;
