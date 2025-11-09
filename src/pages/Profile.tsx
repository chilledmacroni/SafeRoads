import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import Navigation from "@/components/Navigation";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, MapPin, Edit, Save, X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
// --- IMPORT ADDED HERE ---
import { Badge } from "@/components/ui/badge";

// Define Report Type
interface Report {
  id: string;
  created_at: string;
  image_url: string;
  location_name: string;
  severity: string;
  // --- MODIFIED HERE ---
  violation_types: { name: string; }[];
}

const Profile = ({ session }: { session: Session | null }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      const fetchProfileAndReports = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", session.user.id)
            .single();

          if (profileError) throw profileError;
          if (profileData) setDisplayName(profileData.display_name || "");

          const { data: reportsData, error: reportsError } = await supabase
            .from("reports")
            .select(`id, created_at, image_url, location_name, severity, violation_types ( name )`)
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

          if (reportsError) throw reportsError;
          // --- CASTING IS NOW CORRECT ---
          setReports(reportsData as Report[]);
        } catch (error: any) {
          setError("Could not fetch profile data: " + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileAndReports();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setSubmitting(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, updated_at: new Date() })
      .eq("id", session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not update profile.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
      setEditing(false);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Please log in</h2>
          <p className="text-muted-foreground">
            Log in to view your profile and report history.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold">My Profile</h1>

        <div className="flex justify-center mb-10">
          <div className="w-full max-w-lg">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {!editing ? (
                  <div className="space-y-3">
                    <p>
                      <strong>Email:</strong> {session.user.email}
                    </p>
                    <p>
                      <strong>Username:</strong> {displayName || "Not set"}
                    </p>
                    <Button variant="outline" onClick={() => setEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Username
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={session.user.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Username</Label>
                      <Input
                        id="displayName"
                        value={displayName || ""}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setEditing(false)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <hr className="my-8" />

        <h2 className="mb-8 mt-10 text-center text-3xl font-bold">
          My Reports
        </h2>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="shadow-lg">
                <CardHeader>
                  <AspectRatio ratio={16 / 9} className="bg-muted">
                    <img
                      src={report.image_url}
                      // --- MODIFIED HERE ---
                      alt={report.violation_types[0]?.name}
                      className="rounded-t-lg object-cover w-full h-full"
                    />
                  </AspectRatio>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-1 text-lg">
                    {/* --- MODIFIED HERE --- */}
                    {report.violation_types[0]?.name}
                  </CardTitle>
                  {report.location_name && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3" />
                      {report.location_name}
                    </div>
                  )}
                  {/* --- THIS SECTION IS NOW FIXED --- */}
                  <Badge
                    variant={
                      report.severity === "High"
                        ? "destructive"
                        : report.severity === "Medium"
                        ? "secondary"
                        : "default"
                    }
                    className="mt-2"
                  >
                    {report.severity}
                  </Badge>
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
            You have not submitted any reports yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;