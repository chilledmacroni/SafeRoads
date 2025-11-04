import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, Shield, Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-traffic.jpg";
import communityIllustration from "@/assets/community-illustration.png";
import captureIllustration from "@/assets/capture-illustration.png";
import reportIllustration from "@/assets/report-illustration.png";
import trackIllustration from "@/assets/track-illustration.png";

const Home = () => {
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
                Join thousands of citizens helping create safer streets by reporting traffic violations
                in your community.
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

          <div className="grid md:grid-cols-3 gap-8">
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

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg rounded-3xl overflow-hidden">
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
            </Card>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
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

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <Card className="rounded-3xl border-2 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl">
                    SJ
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">Sarah Johnson</h3>
                <Badge variant="default" className="mb-3">Community Champion</Badge>
                <div className="text-2xl font-bold text-primary">156</div>
                <p className="text-sm text-muted-foreground">Reports</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl">
                    MC
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">Michael Chen</h3>
                <Badge variant="reviewed" className="mb-3">Safety Hero</Badge>
                <div className="text-2xl font-bold text-primary">134</div>
                <p className="text-sm text-muted-foreground">Reports</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl">
                    ED
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">Emma Davis</h3>
                <Badge variant="closed" className="mb-3">Road Guardian</Badge>
                <div className="text-2xl font-bold text-primary">118</div>
                <p className="text-sm text-muted-foreground">Reports</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/leaderboard">
                View Full Leaderboard
              </Link>
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
          <p>© 2025 SafeRoads. Making communities safer, one report at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
