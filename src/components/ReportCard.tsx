import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trash2, Edit } from "lucide-react";

interface ReportCardProps {
  id: string;
  vehicleNumber: string;
  location: string;
  date: string;
  status: "pending" | "reviewed" | "closed";
  violationType: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ReportCard = ({
  id,
  vehicleNumber,
  location,
  date,
  status,
  violationType,
  onEdit,
  onDelete,
}: ReportCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "pending";
      case "reviewed":
        return "reviewed";
      case "closed":
        return "closed";
      default:
        return "default";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{vehicleNumber}</h3>
            <p className="text-sm text-muted-foreground">{violationType}</p>
          </div>
          <Badge variant={getStatusVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(id)}
            className="flex-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
