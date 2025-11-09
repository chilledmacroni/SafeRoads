import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  LayoutDashboard,
  Info,
  Menu,
  User,
  LogOut,
  LogIn,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home", icon: LayoutDashboard },
    { to: "/report", label: "Report", icon: FileText, auth: true },
    { to: "/dashboard", label: "Feed", icon: LayoutDashboard },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/about", label: "About", icon: Info },
    { to: "/admin", label: "Admin", icon: ShieldAlert, admin: true },
  ];

  const getFilteredLinks = () => {
    // This simple check can be expanded with a proper roles system
    const isAdmin = session?.user.email?.includes("admin");
    return navLinks.filter((link) => {
      if (link.admin) return isAdmin;
      return true;
    });
  };

  const MobileNav = () => (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex flex-col gap-4 pt-8">
          {getFilteredLinks().map((link) => (
            <Button
              key={link.to}
              variant={isActive(link.to) ? "default" : "ghost"}
              size="lg"
              asChild
              onClick={() => setIsSheetOpen(false)}
              className="justify-start gap-2"
            >
              <Link to={link.to}>
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            </Button>
          ))}
          <DropdownMenuSeparator />
          {session ? (
            <>
              <Button
                variant="ghost"
                size="lg"
                asChild
                onClick={() => setIsSheetOpen(false)}
                className="justify-start gap-2"
              >
                <Link to="/profile">
                  <User className="h-5 w-5" />
                  My Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  handleLogout();
                  setIsSheetOpen(false);
                }}
                className="justify-start gap-2 text-red-500 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="lg"
              asChild
              onClick={() => setIsSheetOpen(false)}
              className="justify-start gap-2"
            >
              <Link to="/auth">
                <LogIn className="h-5 w-5" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopNav = () => (
    <div className="flex items-center gap-2">
      {getFilteredLinks().map((link) => (
        <Button
          key={link.to}
          variant={isActive(link.to) ? "default" : "ghost"}
          size="sm"
          asChild
          className="gap-1"
        >
          <Link to={link.to}>
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        </Button>
      ))}

      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {session.user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex gap-2 text-red-500 focus:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/auth">
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </Button>
      )}
    </div>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl"
            onClick={() => isSheetOpen && setIsSheetOpen(false)}
          >
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SafeRoads
            </span>
          </Link>

          {isMobile ? <MobileNav /> : <DesktopNav />}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;