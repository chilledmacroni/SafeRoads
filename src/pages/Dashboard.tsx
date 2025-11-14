import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, MapPin } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Define Report Type
interface Report {
  id: string;
  created_at: string;
  image_url: string;
  location_name: string;
  severity: "Low" | "Medium" | "High";
  title: string;
  description: string;
  // --- FIX: Changed from an array to a single object or null ---
  violation_types: {
    name: string;
    description: string;
  } | null;
}

const ReportsFeed = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(
          `
          id,
          created_at,
          image_url,
          location_name,
          severity,
          title, 
          description,
          violation_types ( name, description )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        setError("Could not fetch the reports feed.");
        console.error(error);
      } else {
        // --- FIX: This cast is now correct because the interface matches ---
        setReports(data as Report[]);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Violation Reports
        </h1>

        {loading && (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="shadow-lg">
              <CardHeader>
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <img
                    src={report.image_url}
                    // --- FIX: Removed [0] array indexing ---
                    alt={report.title || report.violation_types?.name}
                    className="rounded-t-lg object-cover w-full h-full"
                  />
                </AspectRatio>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">
                    {/* --- FIX: Removed [0] array indexing --- */}
                    {report.violation_types?.name}
                  </Badge>
                  <Badge variant={getSeverityBadge(report.severity)}>
                    {report.severity}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {/* --- FIX: Removed [0] array indexing --- */}
                  {report.violation_types?.description}
                </p>

                <CardTitle className="mb-1 text-lg">
                  {report.title || "Violation Report"}
                </CardTitle>

                {report.description && (
                  <CardDescription className="text-sm mt-1">
                    <span className="font-semibold">Report Details:</span>{" "}
                    {report.description}
                  </CardDescription>
                )}

                {report.location_name && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <MapPin className="h-3 w-3" />
                    {report.location_name}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <small className="text-xs text-muted-foreground">
                  Reported on:{" "}
                  {new Date(report.created_at).toLocaleDateString()}
                </small>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsFeed;
