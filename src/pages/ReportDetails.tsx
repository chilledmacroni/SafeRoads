import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";

// Helper from P2
const dataURLtoFile = (dataurl: string, filename: string) => {
  let arr = dataurl.split(","),
    mimeMatch = arr[0].match(/:(.*?);/),
    mime = mimeMatch ? mimeMatch[1] : "image/jpeg",
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Define types
interface Coords {
  latitude: number;
  longitude: number;
}
interface ViolationType {
  // --- 1. FIX: Corrected type from string to number ---
  id: number;
  name: string;
}

const ReportDetails = ({ session }: { session: Session | null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { image, title, description } =
    (location.state as {
      image: string;
      title: string;
      description: string;
    }) || {};

  const [formData, setFormData] = useState({
    violation_type_id: "",
    severity: "Low",
    location_name: "",
    title: title || "",
    description: description || "",
  });
  const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      toast({
        title: "No Image Found",
        description: "Please go back and capture an image first.",
        variant: "destructive",
      });
      navigate("/report");
    }

    const fetchInitialData = async () => {
      // 1. Fetch Violation Types
      const { data, error: typeError } = await supabase
        .from("violation_types")
        .select("*");
      if (typeError) {
        setError("Could not fetch violation types.");
      } else {
        setViolationTypes(data as ViolationType[]);
      }

      // 2. Get Geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setError(
            "Location access was denied. Please enable it in your browser."
          );
        }
      );
      setLoading(false);
    };

    fetchInitialData();
  }, [image, navigate, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) {
      setError("Cannot submit without location coordinates.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      // 1. Upload Image
      const file = dataURLtoFile(image, `report-${Date.now()}.jpg`);
      const filePath = `public/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("report_images")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from("report_images")
        .getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      // 3. Prepare Report Data
      const reportData: any = {
        ...formData,
        latitude: coords.latitude,
        longitude: coords.longitude,
        image_url: imageUrl,
      };

      // 4. Add user_id if logged in
      if (session) {
        reportData.user_id = session.user.id;
      }

      // 5. Insert Report
      const { error: insertError } = await supabase
        .from("reports")
        .insert([reportData]);
      if (insertError) throw insertError;

      toast({
        title: "Report Submitted!",
        description: "Thank you for making the roads safer.",
      });
      navigate("/dashboard"); // Navigate to the reports feed
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle>Violation Details</CardTitle>
            <CardDescription>
              Provide the final details for your report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <img
              src={image}
              alt="Report preview"
              className="rounded-lg w-full mb-4"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="violation_type_id">Type of Violation</Label>
                <Select
                  name="violation_type_id"
                  value={formData.violation_type_id}
                  onValueChange={(value) =>
                    handleSelectChange("violation_type_id", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select a violation --" />
                  </SelectTrigger>
                  <SelectContent>
                    {violationTypes.map((type) => (
                      // --- 2. FIX: Convert number to string for the value prop ---
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  name="severity"
                  value={formData.severity}
                  onValueChange={(value) =>
                    handleSelectChange("severity", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_name">Location Name (Optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location_name"
                    name="location_name"
                    placeholder="e.g., Near City Mall"
                    className="pl-10"
                    value={formData.location_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {coords && (
                <p className="text-sm text-muted-foreground">
                  Location captured: {coords.latitude.toFixed(4)},{" "}
                  {coords.longitude.toFixed(4)}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportDetails;
