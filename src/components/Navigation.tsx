import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, FileText, LayoutDashboard, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SafeRoads
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">
                <LayoutDashboard className="h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button
              variant={isActive("/report") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/report">
                <FileText className="h-4 w-4" />
                Report
              </Link>
            </Button>
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={isActive("/about") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/about">
                <Info className="h-4 w-4" />
                About
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
