import { useState } from "react";
import Navigation from "@/components/Navigation";
import ReportCard from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockReports = [
  {
    id: "1",
    vehicleNumber: "ABC-1234",
    location: "Main St & 5th Ave",
    date: "2025-01-15",
    status: "pending" as const,
    violationType: "Red Light Violation",
  },
  {
    id: "2",
    vehicleNumber: "XYZ-5678",
    location: "Park Ave & 3rd St",
    date: "2025-01-14",
    status: "reviewed" as const,
    violationType: "Speeding",
  },
  {
    id: "3",
    vehicleNumber: "DEF-9012",
    location: "Highway 101, Mile 45",
    date: "2025-01-13",
    status: "closed" as const,
    violationType: "Lane Violation",
  },
  {
    id: "4",
    vehicleNumber: "GHI-3456",
    location: "Downtown Plaza",
    date: "2025-01-12",
    status: "pending" as const,
    violationType: "Illegal Parking",
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Report",
      description: `Edit functionality for report ${id} will be available soon.`,
    });
  };

  const handleDelete = (id: string) => {
    setReports(reports.filter((report) => report.id !== id));
    toast({
      title: "Report Deleted",
      description: "The report has been successfully deleted.",
      variant: "destructive",
    });
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Reports</h1>
          <p className="text-muted-foreground text-lg">
            Track and manage your submitted violation reports
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle number or location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Under Review</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                {...report}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No reports found</p>
            <Button variant="outline" className="mt-4" asChild>
              <a href="/report">Create Your First Report</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
