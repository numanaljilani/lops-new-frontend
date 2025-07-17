"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
import { toast, Toaster } from "sonner";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/PaginationComponent";
import { formatDate } from "@/lib/dateFormat";
import {
  useAllRFQsMutation,
  useCreateRFQMutation,
  useDeleteRfqMutation,
} from "@/redux/query/rfqsApi";
import Alert from "@/components/dialogs/Alert";
import CreateDialog from "@/components/dialogs/CreateDialog";
import CreateProject from "@/components/dialogs/CreateLPO";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { addYears, startOfYear, endOfYear, format } from "date-fns";
import { defaultStaticRanges } from "react-date-range";

function RFQs() {
  const selectedCompany = useSelector(
    (state: any) => state?.user?.selectedCompany || null
  );
  const router = useRouter();
  const [rfqs, setRFQs] = useState<any[]>([]);
  const [tab, setTab] = useState("all");
  const [filteredRFQs, setFilteredRFQs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);
  const [isCreateLPODialogOpen, setIsCreateLPODialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [rfqsApi, { data, isSuccess, error, isError, isLoading: isRFQsLoading }] = useAllRFQsMutation();
  const [createRFQApi] = useCreateRFQMutation();
  const [deleteRFQApi] = useDeleteRfqMutation();


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
  const getRFQs = async (status: string = tab) => {
    if (!selectedCompany?._id) {
      toast.error("No company selected", {
        description: "Please select a company to view RFQs.",
        style: { backgroundColor: "#fcebbb" },
      });
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const params = {
        page,
        companyId: selectedCompany._id,
        status: status === "all" ? "" : status,
        search: searchQuery,
        startDate: dateRange[0].startDate ? dateRange[0].startDate.toISOString() : undefined,
        endDate: dateRange[0].endDate ? dateRange[0].endDate.toISOString() : undefined,
      };
      const res = await rfqsApi(params).unwrap();
      console.log(`RFQs API Response (status: ${status}):`, JSON.stringify(res, null, 2));
      if (res?.data) {
        setRFQs(res.data);
        setFilteredRFQs(res.data);
      } else {
        toast.warning(`No RFQs found for status: ${status || "all"}.`);
        setRFQs([]);
        setFilteredRFQs([]);
      }
    } catch (err: any) {
      console.error(`RFQs Fetch Error (status: ${status}):`, JSON.stringify(err, null, 2));
      toast.error(`Failed to fetch RFQs: ${err?.data?.message || err.message || "Unknown error"}`, {
        style: { backgroundColor: "#fcebbb" },
      });
      setRFQs([]);
      setFilteredRFQs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRFQs();
  }, [tab, page, selectedCompany, searchQuery, dateRange]);

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

  const handleSubmit = async (data: any) => {
    try {
      console.log("Create RFQ Data:", JSON.stringify(data, null, 2));
      const res = await createRFQApi({ data: { ...data, company: selectedCompany._id } }).unwrap();
      toast.success("RFQ created successfully!");
      getRFQs();
      return res;
    } catch (err: any) {
      console.error("RFQ Creation Error:", JSON.stringify(err, null, 2));
      toast.error(`Failed to create RFQ: ${err?.data?.message || err.message || "Unknown error"}`, {
        style: { backgroundColor: "#fcebbb" },
      });
      throw err;
    }
  };

  const deleteRFQ = async () => {
    if (!itemToDelete?._id) return;
    try {
      console.log("Delete RFQ ID:", itemToDelete._id);
      await deleteRFQApi({ id: itemToDelete._id }).unwrap();
      toast.success("RFQ deleted successfully!");
      setIsDialogOpen(false);
      getRFQs();
    } catch (err: any) {
      console.error("Delete RFQ Error:", JSON.stringify(err, null, 2));
      toast.error(`Failed to delete RFQ: ${err?.data?.message || err.message || "Unknown error"}`, {
        style: { backgroundColor: "#fcebbb" },
      });
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setIsFetchingMore(true);
          setTimeout(() => {
            console.log("Fetching more RFQs...");
            setIsFetchingMore(false);
          }, 1000);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full">
        <main className="grid gap-3 md:gap-4">
          <Tabs defaultValue="all" onValueChange={(value) => { setTab(value); setPage(1); }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <TabsList className="bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="all"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  Approved
                </TabsTrigger>
              </TabsList>
                <div className="relative">
                  <Button
                    size="sm"
                    className="h-8 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    {formatDateRange()}
                  </Button>
                  {showDatePicker && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <DateRangePicker
                        ranges={dateRange}
                        onChange={handleDateRangeSelect}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        direction="horizontal"
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
              <div className="ml-auto flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by RFQ ID, client, etc."
                    className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              
                <Button
                  size="sm"
                  className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                  onClick={() => setIsCreateRFQDialogOpen(true)}
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Generate RFQ
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value={tab}>
              <Card className="bg-white shadow-lg rounded-xl border-none w-full">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    RFQ List
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage your RFQs and view their status
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Table className="overflow-x-auto">
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="text-sm font-medium text-gray-700">Sr. No.</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">RFQ ID</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Client</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Project</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Scope of Work</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Quotation</TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">Created</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Job</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index} className="border-b border-gray-100">
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                              </TableCell>
                              <TableCell><Skeleton className="h-8 w-8 bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-8 w-8 bg-gray-200 rounded-lg" /></TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : filteredRFQs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-sm text-gray-600">
                            No RFQs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRFQs.map((data: any, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                          >
                            <TableCell
                              className="text-sm text-blue-600 hover:underline cursor-pointer font-medium"
                              onClick={() => router.push(`/rfqs/${data._id}`)}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              className="text-sm text-blue-600 hover:underline cursor-pointer font-medium"
                              onClick={() => router.push(`/rfqs/${data._id}`)}
                            >
                              {data?.rfqId || "-"}
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800 font-medium cursor-pointer"
                              onClick={() => router.push(`/rfqs/${data._id}`)}
                            >
                              {data?.client?.client_name?.slice(0, 50) || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-gray-800">
                              {data?.project_type || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-gray-800 max-w-[150px] truncate">
                              {data?.scope_of_work?.slice(0, 50) || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-gray-800">
                              {data?.quotation_amount || "-"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-gray-800">
                              {data?.createdAt ? formatDate(data.createdAt) : "-"}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                className={`h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                                  data.projectId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                                } text-white`}
                                onClick={() => {
                                  if (data?.projectId) {
                                    router.push(`/projects/${data.projectId}`);
                                  } else {
                                    setSelectedRFQ(data);
                                    setIsCreateLPODialogOpen(true);
                                  }
                                }}
                              >
                                {data?.projectId ? (
                                  <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                  <PlusCircle className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    className="bg-gray-100 hover:bg-gray-200 h-8 w-8 rounded-lg"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white border-gray-300 rounded-lg shadow-lg">
                                  <DropdownMenuLabel className="text-sm text-gray-800">Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    className="text-sm text-red-600 hover:bg-red-50"
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="p-4 flex justify-center">
                  <PaginationComponent
                    setPage={setPage}
                    totalPages={data?.totalPages || 1}
                    page={data?.page || 1}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          {isFetchingMore && (
            <div className="col-span-full">
              <Skeleton className="h-24 w-full bg-gray-200 rounded-xl" />
            </div>
          )}
          <div ref={loadMoreRef} className="h-1"></div>
        </main>

        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteRFQ}
          name={itemToDelete?.rfqId || "this RFQ"}
        />
        <CreateDialog
          setIsDialogOpen={setIsCreateRFQDialogOpen}
          isDialogOpen={isCreateRFQDialogOpen}
          handleSubmit={handleSubmit}
        />
        <CreateProject
          setIsDialogOpen={setIsCreateLPODialogOpen}
          isDialogOpen={isCreateLPODialogOpen}
          data={selectedRFQ}
        />
      </div>
    </div>
  );
}

export default RFQs;