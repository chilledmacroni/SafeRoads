import { useState, useEffect } from "react"; // Added hooks
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, Shield, Trophy, Loader2 } from "lucide-react"; // Added Loader2
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { supabase } from "@/supabaseClient"; // Added Supabase client

// Asset Imports
import heroImage from "@/assets/hero-traffic.jpg";
import communityIllustration from "@/assets/community-illustration.png";
import captureIllustration from "@/assets/capture-illustration.png";
import reportIllustration from "@/assets/report-illustration.png";
import trackIllustration from "@/assets/track-illustration.png";

// Define the user type
interface LeaderboardUser {
  user_id: string;
  display_name: string;
  report_count: number;
}

// Helper function to get initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

// Define badge details for ranks
const badgeDetails = [
  { label: "Community Champion", variant: "default" as const },
  { label: "Safety Hero", variant: "reviewed" as const },
  { label: "Road Guardian", variant: "closed" as const },
];

const Home = () => {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      setLoading(true);
      // Fetch only the top 3 users
      const { data, error } = await supabase.rpc("get_leaderboard").limit(3);

      if (!error && data) {
        setTopUsers(data as LeaderboardUser[]);
      } else {
        console.error("Error fetching top users:", error);
        setTopUsers([]); // Set empty array on error
      }
      setLoading(false);
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Report Traffic Violations,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Make Roads Safer
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Join thousands of citizens helping create safer streets by
                reporting traffic violations in your community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/report">
                    <FileText className="h-5 w-5" />
                    Report Violation
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/dashboard">
                    <Eye className="h-5 w-5" />
                    View Reports
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="City traffic monitoring"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to make your community safer
            </p>
          </div>

          {/* --- MODIFIED: Removed the 3rd card as it was commented out in your code --- */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg rounded-3xl overflow-hidden">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-32 h-32 mx-auto mb-4">
                  <img
                    src={captureIllustration}
                    alt="Capture violation"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold">1. Capture</h3>
                <p className="text-muted-foreground">
                  Take a photo or video of the traffic violation with your phone
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg rounded-3xl overflow-hidden">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-32 h-32 mx-auto mb-4">
                  <img
                    src={reportIllustration}
                    alt="Report violation"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold">2. Report</h3>
                <p className="text-muted-foreground">
                  Submit details including location, time, and violation type
                </p>
              </CardContent>
            </Card>

            {/* <Card className="border-2 hover:border-primary transition-all hover:shadow-lg rounded-3xl overflow-hidden">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-32 h-32 mx-auto mb-4">
                  <img 
                    src={trackIllustration} 
                    alt="Track report" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold">3. Track</h3>
                <p className="text-muted-foreground">
                  Monitor the status of your report as authorities investigate
                </p>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview (Now Dynamic) */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-10 w-10 text-primary" />
              <h2 className="text-3xl font-bold">Community Champions</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Meet our top contributors making roads safer every day
            </p>
          </div>

          {/* --- DYNAMIC SECTION --- */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8 min-h-[260px] items-center">
            {loading ? (
              <div className="col-span-1 md:col-span-3 flex justify-center items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : topUsers.length > 0 ? (
              topUsers.map((user, index) => (
                <Card
                  key={user.user_id}
                  className="rounded-3xl border-2 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6 text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl">
                        {getInitials(user.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">
                      {user.display_name}
                    </h3>
                    <Badge
                      variant={badgeDetails[index]?.variant || "default"}
                      className="mb-3"
                    >
                      {badgeDetails[index]?.label || "Top Contributor"}
                    </Badge>
                    <div className="text-2xl font-bold text-primary">
                      {user.report_count}
                    </div>
                    <p className="text-sm text-muted-foreground">Reports</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center text-muted-foreground">
                Be the first to become a community champion!
              </div>
            )}
          </div>
          {/* --- END DYNAMIC SECTION --- */}

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/leaderboard">View Full Leaderboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <img
            src={communityIllustration}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
          <Shield className="h-16 w-16 mx-auto" />
          <h2 className="text-4xl font-bold">Ready to Make a Difference?</h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Every report helps create safer roads for everyone in your community
          </p>
          <Button variant="secondary" size="lg" asChild className="shadow-xl">
            <Link to="/report">Start Reporting Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            © 2025 SafeRoads. Making communities safer, one report at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
