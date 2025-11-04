import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, MapPin, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Report = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    location: "",
    violationType: "",
    description: "",
    file: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Report Submitted Successfully",
      description: "Your traffic violation report has been submitted for review.",
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Report a Violation</h1>
            <p className="text-muted-foreground text-lg">
              Help make roads safer by reporting traffic violations
            </p>
          </div>

          <Card className="shadow-lg rounded-3xl border-2 border-primary/10">
            <CardHeader>
              <CardTitle>Violation Details</CardTitle>
              <CardDescription>
                Please provide as much detail as possible to help with the investigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo/Video Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">Photo/Video Evidence *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        {formData.file ? (
                          <>
                            <Camera className="h-12 w-12 text-primary" />
                            <p className="text-sm font-medium">{formData.file.name}</p>
                            <p className="text-xs text-muted-foreground">Click to change</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 text-muted-foreground" />
                            <p className="text-sm font-medium">Click to upload photo or video</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, MP4 up to 50MB</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Vehicle Number */}
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="e.g., ABC-1234"
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleNumber: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Violation Type */}
                <div className="space-y-2">
                  <Label htmlFor="violationType">Violation Type *</Label>
                  <Select
                    value={formData.violationType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, violationType: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select violation type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="speeding">Speeding</SelectItem>
                      <SelectItem value="red-light">Red Light Violation</SelectItem>
                      <SelectItem value="wrong-way">Wrong Way Driving</SelectItem>
                      <SelectItem value="no-helmet">No Helmet</SelectItem>
                      <SelectItem value="parking">Illegal Parking</SelectItem>
                      <SelectItem value="lane">Lane Violation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., Main Street & 5th Avenue"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide any additional context about the violation..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg">
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Report;
