"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";
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
import { date, timeFormat } from "@/lib/dateFormat";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DeleteItem from "@/components/dialogs/DeleteItem";
import {
  useDeleteTimesheetMutation,
  useTimesheetMutation,
} from "@/redux/query/timesheet";
import { PaginationComponent } from "@/components/PaginationComponent";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { addYears, startOfYear, endOfYear, format } from "date-fns";
import { defaultStaticRanges } from "react-date-range";
import debounce from "lodash.debounce";
import { Skeleton } from "@/components/ui/skeleton";

function TimeSheet() {
  const router = useRouter();
  const selectedCompany = useSelector(
    (state: any) => state?.user?.selectedCompany || null
  );
  const [timesheet, setTimeSheet] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [timeSheetApi, { data, isSuccess, error, isError, isLoading }] = useTimesheetMutation();
  const [deleteTimeSheetApi] = useDeleteTimesheetMutation();

  const getTimeSheetData = async () => {
    if (!selectedCompany?._id) {
      console.error("No company selected");
      setTimeSheet([]);
      return;
    }
    try {
      const params = {
        page,
        companyId: selectedCompany._id,
        search: searchQuery,
        startDate: dateRange[0].startDate ? dateRange[0].startDate.toISOString() : undefined,
        endDate: dateRange[0].endDate ? dateRange[0].endDate.toISOString() : undefined,
      };
      const res = await timeSheetApi(params).unwrap();
      console.log("Timesheet API Response:", JSON.stringify(res, null, 2));
      setTimeSheet(res?.data || []);
    } catch (err: any) {
      console.error("Timesheet Fetch Error:", JSON.stringify(err, null, 2));
      setTimeSheet([]);
    }
  };

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      console.log("Search Input:", query);
      setSearchQuery(query);
      setPage(1);
    }, 500),
    []
  );

  const handleDateRangeSelect = (ranges: any) => {
    setDateRange([ranges.selection]);
    setPage(1);
    setShowDatePicker(false);
  };

  const handleYearSelect = (year: number) => {
    setDateRange([
      {
        startDate: startOfYear(new Date(year, 0, 1)),
        endDate: endOfYear(new Date(year, 0, 1)),
        key: "selection",
      },
    ]);
    setPage(1);
    setShowDatePicker(false);
  };

  const deleteTimeSheet = async () => {
    if (!itemToDelete?._id) return;
    try {
      console.log("Delete Timesheet ID:", itemToDelete._id);
      await deleteTimeSheetApi({ id: itemToDelete._id }).unwrap();
      setIsDialogOpen(false);
      getTimeSheetData();
    } catch (err: any) {
      console.error("Delete Timesheet Error:", JSON.stringify(err, null, 2));
    }
  };

  const update = async (url: string) => {
    console.log("Update Timesheet ID:", url);
    router.push(`/timesheet/${url}`);
  };

  useEffect(() => {
    getTimeSheetData();
  }, [page, selectedCompany, searchQuery, dateRange]);

  useEffect(() => {
    if (isSuccess && data) {
      console.log("Timesheet Data from Server:", JSON.stringify(data, null, 2));
      setTimeSheet(data.data || []);
    }
  }, [isSuccess, data]);
   const formatDateRange = () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) return "Select Date Range";
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getDate() === 1 &&
      startDate.getMonth() === 0 &&
      endDate.getDate() === 31 &&
      endDate.getMonth() === 11
    ) {
      return startDate.getFullYear().toString();
    }
    return `${format(startDate, "MMM d, yyyy")} - ${format(
      endDate,
      "MMM d, yyyy"
    )}`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by remarks..."
                    className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto h-7 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    {formatDateRange()}
                  </Button>
                  {showDatePicker && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-full sm:w-[600px] max-w-[90vw]">
                      <DateRangePicker
                        ranges={dateRange}
                        onChange={handleDateRangeSelect}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        direction="vertical"
                        className="w-full"
                        staticRanges={[
                          ...defaultStaticRanges,
                          {
                            label: "This Year",
                            range: () => ({
                              startDate: startOfYear(new Date()),
                              endDate: endOfYear(new Date()),
                            }),
                            isSelected: (range) =>
                              range.startDate?.getFullYear() === new Date().getFullYear() &&
                              range.endDate?.getFullYear() === new Date().getFullYear(),
                          },
                          {
                            label: "Last Year",
                            range: () => ({
                              startDate: startOfYear(addYears(new Date(), -1)),
                              endDate: endOfYear(addYears(new Date(), -1)),
                            }),
                            isSelected: (range) =>
                              range.startDate?.getFullYear() === addYears(new Date(), -1).getFullYear() &&
                              range.endDate?.getFullYear() === addYears(new Date(), -1).getFullYear(),
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {/* <DropdownMenu>
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
                    <DropdownMenuCheckboxItem>Sales Member</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Team Leads</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Team Members</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Sub-Contractors</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Accounts Members</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button> */}
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
                    Manage your Times and logs and view performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead className="hidden md:table-cell">End</TableHead>
                        <TableHead className="hidden md:table-cell">Hours Logged</TableHead>
                        <TableHead className="hidden md:table-cell">Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Remark</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                          </TableRow>
                        ))
                      ) : timesheet?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-sm text-gray-600">No data available.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        timesheet?.map(
                          (
                            data: {
                              _id: string;
                              created_at: string;
                              startTime: string;
                              endTime: string;
                              date_logged: string;
                              added_date: string;
                              hours_logged: string;
                              remarks: string;
                              total_amount: string;
                              url: string;
                            },
                            index: number
                          ) => (
                            <TableRow key={index} className="cursor-pointer">
                              <TableCell
                                className="font-medium"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data?.created_at ? date(data.created_at) : "-"}
                              </TableCell>
                              <TableCell
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data?.startTime ? timeFormat(data.startTime) : "-"}
                              </TableCell>
                              <TableCell
                                className="hidden md:table-cell"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data?.endTime ? timeFormat(data.endTime) : "-"}
                              </TableCell>
                              <TableCell
                                className="hidden md:table-cell"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data.hours_logged || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {data?.total_amount ? Number(data.total_amount).toFixed(2) : "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {data.remarks || "-"}
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
                                    <DropdownMenuItem
                                      onClick={() => update(data._id)}
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setItemToDelete(data);
                                        setIsDialogOpen(true);
                                      }}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <PaginationComponent
                    setPage={setPage}
                    totalPages={data?.totalPages || 1}
                    page={data?.page || 1}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <DeleteItem
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          text={"Are you sure you want to delete this time sheet."}
          deleteItem={deleteTimeSheet}
        />
      </div>
    </div>
  );
}

export default TimeSheet;