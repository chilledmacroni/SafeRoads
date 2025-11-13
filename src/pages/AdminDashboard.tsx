import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  AlertTriangle,
  Edit,
  Trash,
  Plus,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

// 🗺️ Map Imports
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Fix default Leaflet marker icons ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- Type Definitions ---
interface Profile {
  id: string;
  display_name: string;
  updated_at: string;
}
interface ViolationType {
  id: number;
  name: string;
  description: string;
}
interface Report {
  id: number;
  user_id: string;
  is_resolved: boolean;
  image_url: string;
  location_name: string;
  latitude: number;
  longitude: number;
  severity: "Low" | "Medium" | "High";
  violation_type_id: number;
  profile: Profile | null;
  violation_type: ViolationType | null;
}

// --- Main Dashboard Component ---
const AdminDashboard = ({ session }: { session: Session | null }) => {
  const navigate = useNavigate();
  const isAdmin = session?.user?.email?.includes("admin") || false;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
              <ShieldAlert className="mx-auto h-12 w-12" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You do not have permission to view this page.
            </p>
            <Button asChild className="mt-6">
              <Link to="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <DashboardView onLogout={handleLogout} />;
};

// --- Dashboard View (Protected) ---
const DashboardView = ({ onLogout }: { onLogout: () => void }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profilesRes, reportsRes, typesRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("violation_types").select("*"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (reportsRes.error) throw reportsRes.error;
      if (typesRes.error) throw typesRes.error;

      const profilesData = (profilesRes.data as Profile[]) || [];
      const reportsData = (reportsRes.data as any[]) || [];
      const typesData = (typesRes.data as ViolationType[]) || [];

      const enrichedReports = reportsData.map((r) => ({
        ...r,
        profile: profilesData.find((p) => p.id === r.user_id) || null,
        violation_type:
          typesData.find((t) => t.id === r.violation_type_id) || null,
      }));

      setProfiles(profilesData);
      setReports(enrichedReports as Report[]);
      setViolationTypes(typesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (table: string, id: string | number) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) setError(error.message);
    else fetchData();
  };

  const handleViolationTypeSubmit = async (type: Partial<ViolationType>) => {
    let query;
    const { id, ...formData } = type;
    if (id) {
      query = supabase.from("violation_types").update(formData).eq("id", id);
    } else {
      query = supabase.from("violation_types").insert([formData]);
    }
    const { error } = await query;
    if (error) setError(error.message);
    else fetchData();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="reports">
          <TabsList>
            <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
            <TabsTrigger value="profiles">
              Profiles ({profiles.length})
            </TabsTrigger>
            <TabsTrigger value="violationTypes">
              Violation Types ({violationTypes.length})
            </TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-4">
            <ReportsTable reports={reports} handleDelete={handleDelete} />
          </TabsContent>

          <TabsContent value="profiles" className="mt-4">
            <ProfilesTable profiles={profiles} handleDelete={handleDelete} />
          </TabsContent>

          <TabsContent value="violationTypes" className="mt-4">
            <ViolationTypesTable
              violationTypes={violationTypes}
              handleDelete={handleDelete}
              handleSubmit={handleViolationTypeSubmit}
            />
          </TabsContent>

          <TabsContent value="map" className="mt-4">
            <ReportsMap reports={reports} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

// --- Reports Table ---
const ReportsTable = ({
  reports,
  handleDelete,
}: {
  reports: Report[];
  handleDelete: (table: string, id: number) => void;
}) => {
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

  const renderLocation = (r: Report) => {
    const mapUrl = `https://www.google.com/maps?q=${r.latitude},${r.longitude}`;
    return (
      <div>
        <div>{r.location_name || "Unnamed Location"}</div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline flex items-center"
        >
          View Map <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    );
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Violation</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <a href={r.image_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={r.image_url}
                    alt="violation"
                    className="h-16 w-16 object-cover rounded"
                  />
                </a>
              </TableCell>
              <TableCell>{r.violation_type?.name || "N/A"}</TableCell>
              <TableCell>
                {r.profile ? (
                  <Link
                    to={`/profile/${r.user_id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {r.profile.display_name}
                  </Link>
                ) : (
                  "Anonymous"
                )}
              </TableCell>
              <TableCell>{renderLocation(r)}</TableCell>
              <TableCell>
                <Badge variant={getSeverityBadge(r.severity)}>
                  {r.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <DeleteAlert onConfirm={() => handleDelete("reports", r.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

// --- Profiles Table ---
const ProfilesTable = ({
  profiles,
  handleDelete,
}: {
  profiles: Profile[];
  handleDelete: (table: string, id: string) => void;
}) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Display Name</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="text-xs">{p.id}</TableCell>
            <TableCell>{p.display_name}</TableCell>
            <TableCell>
              {p.updated_at && new Date(p.updated_at).toLocaleString()}
            </TableCell>
            <TableCell>
              <DeleteAlert onConfirm={() => handleDelete("profiles", p.id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

// --- Violation Types Table ---
const ViolationTypesTable = ({
  violationTypes,
  handleDelete,
  handleSubmit,
}: {
  violationTypes: ViolationType[];
  handleDelete: (table: string, id: number) => void;
  handleSubmit: (type: Partial<ViolationType>) => void;
}) => (
  <Card>
    <CardHeader>
      <ViolationTypeModal
        trigger={
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Type
          </Button>
        }
        onSubmit={handleSubmit}
      />
    </CardHeader>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {violationTypes.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.id}</TableCell>
            <TableCell>{t.name}</TableCell>
            <TableCell>{t.description}</TableCell>
            <TableCell className="flex gap-2">
              <ViolationTypeModal
                trigger={
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                }
                onSubmit={handleSubmit}
                editType={t}
              />
              <DeleteAlert
                onConfirm={() => handleDelete("violation_types", t.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

// --- Violation Type Modal ---
const ViolationTypeModal = ({
  trigger,
  onSubmit,
  editType,
}: {
  trigger: React.ReactNode;
  onSubmit: (type: Partial<ViolationType>) => void;
  editType?: ViolationType;
}) => {
  const [name, setName] = useState(editType?.name || "");
  const [description, setDescription] = useState(editType?.description || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(editType?.name || "");
      setDescription(editType?.description || "");
    }
  }, [isOpen, editType]);

  const handleSubmit = () => {
    onSubmit({ id: editType?.id, name, description });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editType ? "Edit Violation Type" : "Add Violation Type"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>
            {editType ? "Update Type" : "Add Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Reusable Delete Alert Component ---
const DeleteAlert = ({ onConfirm }: { onConfirm: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item
            from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// --- Reports Map Component ---
const ReportsMap = ({ reports }: { reports: Report[] }) => {
  const validReports = reports.filter((r) => r.latitude && r.longitude);
  const center = [22.9734, 78.6569]; // MP approx center

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "blue";
    }
  };

  const createCustomIcon = (color: string) =>
    new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Report Concentration Map</CardTitle>
        <CardDescription>
          Explore report hotspots and violation clusters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validReports.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No reports with location data.
          </p>
        ) : (
          <div className="h-[600px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={center as any}
              zoom={6}
              scrollWheelZoom
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerClusterGroup chunkedLoading>
                {validReports.map((r) => (
                  <Marker
                    key={r.id}
                    position={[r.latitude, r.longitude] as any}
                    icon={createCustomIcon(getSeverityColor(r.severity))}
                  >
                    <Popup>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm">
                          {r.violation_type?.name || "Unknown Violation"}
                        </h3>
                        <p className="text-xs">
                          Severity:{" "}
                          <span className="font-semibold">{r.severity}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.location_name || "Unnamed Location"}
                        </p>
                        {r.image_url && (
                          <a
                            href={r.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            View Image
                          </a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;