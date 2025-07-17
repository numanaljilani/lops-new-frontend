"use client";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useJobsMutation, useDeleteJobCardMutation } from "@/redux/query/jobApi";
import { useCreateRFQMutation } from "@/redux/query/rfqsApi";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/dialogs/Alert";
import CreateDialog from "@/components/dialogs/CreateDialog";
import CreateTask from "@/components/dialogs/CreateTask";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationComponent } from "@/components/PaginationComponent";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";
import { formatDate } from "@/lib/dateFormat";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { addYears, startOfYear, endOfYear, format } from "date-fns";
import { defaultStaticRanges } from "react-date-range";

export default function Projects() {
  const router = useRouter();
  const selectedCompany = useSelector(
    (state: any) => state?.user?.selectedCompany || null
  );
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [projectDetails, setProjectDetails] = useState<any>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const itemsPerPage = 5;

  const [jobApi, { data, isSuccess, error, isError, isLoading: isJobApiLoading }] = useJobsMutation();
  const [deleteJobCardApi] = useDeleteJobCardMutation();
  const [createRFQApi] = useCreateRFQMutation();

  const getJobs = async () => {
    if (!selectedCompany?._id) {
      console.error("No company selected");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = {
        page,
        companyId: selectedCompany._id,
        search: searchQuery,
        startDate: dateRange[0].startDate ? dateRange[0].startDate.toISOString() : undefined,
        endDate: dateRange[0].endDate ? dateRange[0].endDate.toISOString() : undefined,
      };
      const res = await jobApi(params).unwrap();
      console.log("Jobs API Response:", JSON.stringify(res, null, 2));
      setJobs(res?.data || []);
    } catch (err: any) {
      console.error("Jobs Fetch Error:", JSON.stringify(err, null, 2));
      setJobs([]);
    } finally {
      setLoading(false);
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

  const handleSubmit = async (data: any) => {
    console.log("Submit Data:", JSON.stringify(data, null, 2));
    try {
      const res = await createRFQApi({ data, company: selectedCompany._id }).unwrap();
      console.log("Create RFQ Response:", JSON.stringify(res, null, 2));
      setIsCreateRFQDialogOpen(false);
      getJobs();
    } catch (err: any) {
      console.error("Create RFQ Error:", JSON.stringify(err, null, 2));
    }
  };

  const deleteJobCard = async () => {
    try {
      const res = await deleteJobCardApi({ id: itemToDelete._id }).unwrap();
      console.log("Delete Job Response:", JSON.stringify(res, null, 2));
      setIsDialogOpen(false);
      getJobs();
    } catch (err: any) {
      console.error("Delete Job Error:", JSON.stringify(err, null, 2));
    }
  };

  useEffect(() => {
    getJobs();
  }, [page, selectedCompany, searchQuery, dateRange]);

  useEffect(() => {
    if (isSuccess) {
      setJobs(data?.data || []);
      setLoading(false);
    }
  }, [isSuccess, data]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full mx-auto">
        <main className="grid gap-3 md:gap-4">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by Job No, RFQ ID..."
                    className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto h-8 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
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
                <Button
                  size="sm"
                  className="w-full sm:w-auto h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={() => setIsCreateRFQDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Create Project
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card className="bg-white shadow-lg rounded-xl border-none">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Projects
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage your projects and view their status
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell text-sm font-medium text-gray-700 w-[100px]">
                          Sr. No
                        </TableHead>
                        <TableHead className="hidden sm:table-cell text-sm font-medium text-gray-700 w-[100px]">
                          Job No
                        </TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Client</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Project Name</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Scope</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Status</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Amount</TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Deadline
                        </TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: itemsPerPage }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell className="hidden sm:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : jobs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-sm text-gray-600">No data available</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        jobs.map((data: any, index: number) => (
                          <TableRow key={index} className="cursor-pointer">
                            <TableCell
                              className="text-sm text-blue-600 hover:underline cursor-pointer font-medium"
                              onClick={() => router.push(`/projects/${data._id}`)}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              className="text-sm text-blue-600 hover:underline cursor-pointer font-medium"
                              onClick={() => router.push(`/projects/${data._id}`)}
                            >
                              {data?.projectId || "-"}
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800 font-medium"
                              onClick={() => router.push(`/projects/${data._id}`)}
                            >
                              {data?.rfq?.client?.client_name || "-"}
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800 font-medium"
                              onClick={() => router.push(`/projects/${data._id}`)}
                            >
                              {data?.project_name || "-"}
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800 max-w-[150px] truncate"
                              onClick={() => router.push(`/projects/${data._id}`)}
                            >
                              {data?.scope_of_work?.slice(0, 50) || "-"}
                            </TableCell>
                            <TableCell
                              onClick={() => router.push(`/projects/${data._id}`)}
                            >
                              <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-sm">
                                {data?.completion_percentage || 0}%
                              </Badge>
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800"
                              onClick={() => router.push(`/projects/${data._id}`)}
                            >
                              {data?.final_amount ? `${data.final_amount} AED` : "-"}
                            </TableCell>
                            <TableCell
                              className="hidden md:table-cell text-sm text-gray-800"
                            >
                              {formatDate(data?.delivery_timelines) || "-"}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    className="bg-gray-100 hover:bg-gray-200 h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel className="text-sm text-gray-800">
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setIsTaskDialogOpen(true);
                                      setProjectDetails(data);
                                    }}
                                    className="text-sm text-gray-800"
                                  >
                                    Task
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/projects/${data._id}`)}
                                    className="text-sm text-gray-800"
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setItemToDelete(data);
                                      setIsDialogOpen(true);
                                    }}
                                    className="text-sm text-gray-800"
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
        </main>
        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteJobCard}
          name={itemToDelete?.project_name}
        />
        <CreateDialog
          isDialogOpen={isCreateRFQDialogOpen}
          setIsDialogOpen={setIsCreateRFQDialogOpen}
          handleSubmit={handleSubmit}
        />
        {/* <CreateTask
          isDialogOpen={isTaskDialogOpen}
          setIsDialogOpen={setIsTaskDialogOpen}
          data={projectDetails}
        /> */}
      </div>
    </div>
  );
}