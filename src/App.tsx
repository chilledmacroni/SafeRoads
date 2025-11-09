import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";

// Page Imports
import Home from "./pages/Home";
import Report from "./pages/Report";
import ReportDetails from "./pages/ReportDetails"; // New
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Auth from "./pages/Auth"; // New
import Profile from "./pages/Profile"; // New
import UserProfile from "./pages/UserProfile"; // New
import AdminDashboard from "./pages/AdminDashboard"; // New
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Clean up subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* P1's Original Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* P2's Merged Routes */}
            <Route path="/report" element={<Report />} />
            <Route
              path="/report-details"
              element={<ReportDetails session={session} />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile session={session} />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            
            {/* --- THIS IS THE CORRECTED LINE --- */}
            <Route path="/admin" element={<AdminDashboard session={session} />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;