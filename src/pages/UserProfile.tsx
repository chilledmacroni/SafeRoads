import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

// Define Types
interface Profile {
  display_name: string;
}
interface Report {
  id: string;
  created_at: string;
  image_url: string;
  location_name: string;
  severity: "Low" | "Medium" | "High";
  title: string;
  description: string;
  violation_types: { name: string };
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", userId)
            .single();

          if (profileError) throw new Error("Could not find this user.");
          setProfile(profileData as Profile);

          const { data: reportsData, error: reportsError } = await supabase
            .from("reports")
            .select(
              `*, title, description, violation_types ( name )`
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (reportsError) throw new Error("Could not fetch user reports.");
          setReports(reportsData as Report[]);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {error ? (
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !profile ? (
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>User profile not found.</AlertDescription>
          </Alert>
        ) : (
          <>
            <h1 className="mb-8 text-center text-4xl font-bold">
              {profile.display_name}'s Reports
            </h1>

            {reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <Card key={report.id} className="shadow-lg">
                    <CardHeader>
                      <AspectRatio ratio={16 / 9} className="bg-muted">
                        <img
                          src={report.image_url}
                          alt={report.title || report.violation_types.name}
                          className="rounded-t-lg object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">
                          {report.violation_types.name}
                        </Badge>
                        <Badge
                          variant={
                            report.severity === "High"
                              ? "destructive"
                              : report.severity === "Medium"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {report.severity}
                        </Badge>
                      </div>
                      <CardTitle className="mb-1 text-lg">
                        {report.title || report.violation_types.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {report.description}
                      </CardDescription>
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
            ) : (
              <p className="text-center text-muted-foreground">
                This user has not submitted any reports yet.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;