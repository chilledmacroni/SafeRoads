import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js"; // Import Session
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
  
  // Check if the user is an admin based on their email in the session
  const isAdmin = session?.user?.email?.includes("admin") || false;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // If the user is not an admin, show an "Access Denied" page
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

  // If the user *is* an admin, show the dashboard
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
    // This will now work because the logged-in user is an admin
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) setError(error.message);
    else fetchData(); // Refresh data
  };

  const toggleResolved = async (id: number, currentValue: boolean) => {
    // This will also work now
    const { error } = await supabase
      .from("reports")
      .update({ is_resolved: !currentValue })
      .eq("id", id);
    if (error) setError(error.message);
    else fetchData();
  };

  const handleViolationTypeSubmit = async (
    type: Partial<ViolationType>
  ) => {
    let query;
    const { id, ...formData } = type;
    if (id) {
      query = supabase
        .from("violation_types")
        .update(formData)
        .eq("id", id);
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
            <TabsTrigger value="profiles">Profiles ({profiles.length})</TabsTrigger>
            <TabsTrigger value="violationTypes">
              Violation Types ({violationTypes.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="mt-4">
            <ReportsTable
              reports={reports}
              handleDelete={handleDelete}
              toggleResolved={toggleResolved}
            />
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
        </Tabs>
      )}
    </div>
  );
};

// --- Reports Table Component (Unchanged) ---
const ReportsTable = ({
  reports,
  handleDelete,
  toggleResolved,
}: {
  reports: Report[];
  handleDelete: (table: string, id: number) => void;
  toggleResolved: (id: number, current: boolean) => void;
}) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      default: return "default";
    }
  };

  const renderLocation = (r: Report) => {
    const mapUrl = `http://googleusercontent.com/maps/google.com/0{r.latitude},${r.longitude}`;
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
            {/* <TableHead>Status</TableHead> */}
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
                ) : ( "Anonymous" )}
              </TableCell>
              <TableCell>{renderLocation(r)}</TableCell>
              <TableCell>
                <Badge variant={getSeverityBadge(r.severity)}>
                  {r.severity}
                </Badge>
              </TableCell>
              {/* <TableCell>
                <Button
                  variant={r.is_resolved ? "default" : "secondary"}
                  size="sm"
                  onClick={() => toggleResolved(r.id, r.is_resolved)}
                >
                  {r.is_resolved ? "Resolved" : "Pending"}
                </Button>
              </TableCell> */}
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

// --- Profiles Table Component (Unchanged) ---
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

// --- Violation Types Table Component (Unchanged) ---
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

// --- Violation Type Edit/Add Modal ---
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
              // --- THIS IS THE CORRECTED LINE ---
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Delete Confirmation Alert (Unchanged) ---
const DeleteAlert = ({ onConfirm }: { onConfirm: () => void }) => (
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
          This action cannot be undone. This will permanently delete the
          record.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default AdminDashboard;