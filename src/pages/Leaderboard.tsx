import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock leaderboard data
const topReporters = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    reports: 156,
    resolved: 142,
    rank: 1,
    badge: "Community Champion",
    color: "bg-yellow-500",
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    reports: 134,
    resolved: 125,
    rank: 2,
    badge: "Safety Hero",
    color: "bg-gray-400",
  },
  {
    id: 3,
    name: "Emma Davis",
    initials: "ED",
    reports: 118,
    resolved: 110,
    rank: 3,
    badge: "Road Guardian",
    color: "bg-amber-600",
  },
  {
    id: 4,
    name: "James Wilson",
    initials: "JW",
    reports: 95,
    resolved: 88,
    rank: 4,
    badge: "Civic Star",
    color: "bg-primary/20",
  },
  {
    id: 5,
    name: "Olivia Martinez",
    initials: "OM",
    reports: 87,
    resolved: 79,
    rank: 5,
    badge: "Active Reporter",
    color: "bg-primary/20",
  },
  {
    id: 6,
    name: "David Brown",
    initials: "DB",
    reports: 76,
    resolved: 71,
    rank: 6,
    badge: "Active Reporter",
    color: "bg-primary/20",
  },
  {
    id: 7,
    name: "Sophia Lee",
    initials: "SL",
    reports: 68,
    resolved: 62,
    rank: 7,
    badge: "Contributing Member",
    color: "bg-primary/20",
  },
  {
    id: 8,
    name: "Daniel Kim",
    initials: "DK",
    reports: 54,
    resolved: 49,
    rank: 8,
    badge: "Contributing Member",
    color: "bg-primary/20",
  },
];

const stats = [
  { label: "Total Reports", value: "12,450", icon: TrendingUp },
  { label: "Active Reporters", value: "2,341", icon: Star },
  { label: "Resolved Cases", value: "10,580", icon: Award },
];

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Medal className="h-8 w-8 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Community Leaderboard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrating our top contributors making roads safer for everyone
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="border-2 rounded-3xl hover:shadow-lg transition-all hover:border-primary/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 text-center">
                <stat.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Top Contributors</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* 2nd Place */}
            <div className="md:order-1 animate-scale-in" style={{ animationDelay: "100ms" }}>
              <Card className="rounded-3xl border-4 border-gray-400/50 hover:shadow-xl transition-all hover:-translate-y-2">
                <CardContent className="pt-8 text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 mx-auto ring-4 ring-gray-400/30">
                      <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-500 text-white text-2xl">
                        {topReporters[1].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full p-3 shadow-lg">
                      <Medal className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{topReporters[1].name}</h3>
                  <Badge variant="reviewed" className="mb-3">{topReporters[1].badge}</Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reports:</span>
                      <span className="font-semibold">{topReporters[1].reports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolved:</span>
                      <span className="font-semibold text-success">{topReporters[1].resolved}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 1st Place */}
            <div className="md:order-2 animate-scale-in" style={{ animationDelay: "0ms" }}>
              <Card className="rounded-3xl border-4 border-yellow-500/50 hover:shadow-xl transition-all hover:-translate-y-3 md:scale-110">
                <CardContent className="pt-8 text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-28 w-28 mx-auto ring-4 ring-yellow-500/50">
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-3xl">
                        {topReporters[0].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-4 -right-2 bg-yellow-500 rounded-full p-4 shadow-lg animate-pulse">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{topReporters[0].name}</h3>
                  <Badge className="mb-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                    {topReporters[0].badge}
                  </Badge>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reports:</span>
                      <span className="font-semibold text-lg">{topReporters[0].reports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolved:</span>
                      <span className="font-semibold text-lg text-success">{topReporters[0].resolved}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3rd Place */}
            <div className="md:order-3 animate-scale-in" style={{ animationDelay: "200ms" }}>
              <Card className="rounded-3xl border-4 border-amber-600/50 hover:shadow-xl transition-all hover:-translate-y-2">
                <CardContent className="pt-8 text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 mx-auto ring-4 ring-amber-600/30">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white text-2xl">
                        {topReporters[2].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 bg-amber-600 rounded-full p-3 shadow-lg">
                      <Medal className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{topReporters[2].name}</h3>
                  <Badge variant="closed" className="mb-3">{topReporters[2].badge}</Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reports:</span>
                      <span className="font-semibold">{topReporters[2].reports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolved:</span>
                      <span className="font-semibold text-success">{topReporters[2].resolved}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Top 10 Rankings</h2>
          <div className="space-y-3">
            {topReporters.slice(3).map((reporter, index) => (
              <Card
                key={reporter.id}
                className="rounded-3xl border-2 hover:shadow-lg transition-all hover:border-primary/50 hover:-translate-x-2 animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 50}ms` }}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 text-center">
                      {getRankIcon(reporter.rank)}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {reporter.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{reporter.name}</h3>
                      <Badge variant="outline" className="text-xs">{reporter.badge}</Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{reporter.reports}</span> reports
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-success">{reporter.resolved}</span> resolved
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "600ms" }}>
          <Card className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 max-w-3xl mx-auto">
            <CardContent className="py-12">
              <Star className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Start reporting violations today and climb the leaderboard while making your community safer!
              </p>
              <Badge variant="default" className="text-base px-6 py-2">
                Make Your First Report to Get Started
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
