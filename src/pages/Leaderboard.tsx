import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp, Star, Loader2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/supabaseClient";
// --- IMPORT ADDED HERE ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// Define types
interface LeaderboardUser {
  user_id: string;
  display_name: string;
  report_count: number;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Call the database function from P2
      const { data, error } = await supabase.rpc("get_leaderboard");

      if (error) {
        setError("Could not fetch leaderboard data.");
        console.error(error);
      } else {
        setUsers(data as LeaderboardUser[]);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Medal className="h-8 w-8 text-amber-600" />;
      default:
        return (
          <span className="text-2xl font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Static stats, can be replaced with RPC calls later
  const stats = [
    { label: "Total Reports", value: "12,450", icon: TrendingUp },
    { label: "Active Reporters", value: "2,341", icon: Star },
    { label: "Resolved Cases", value: "10,580", icon: Award },
  ];

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

        {/* Stats Cards - (Kept from P1, static) */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="border-2 rounded-3xl hover:shadow-lg transition-all hover:border-primary/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 text-center">
                <stat.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Data Driven Leaderboard --- */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}

        {/* --- THIS SECTION IS NOW FIXED --- */}
        {error && (
          <Alert variant="destructive" className="max-w-lg mx-auto my-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && users.length > 0 && (
          <>
            {/* Top 3 Podium */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                Top Contributors
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* 2nd Place */}
                {users[1] && (
                  <div
                    className="md:order-1 animate-scale-in"
                    style={{ animationDelay: "100ms" }}
                  >
                    <Card className="rounded-3xl border-4 border-gray-400/50 hover:shadow-xl transition-all hover:-translate-y-2">
                      <CardContent className="pt-8 text-center">
                        <div className="relative mb-4">
                          <Avatar className="h-24 w-24 mx-auto ring-4 ring-gray-400/30">
                            <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-500 text-white text-2xl">
                              {getInitials(users[1].display_name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          <Link to={`/profile/${users[1].user_id}`}>
                            {users[1].display_name}
                          </Link>
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-center">
                            <span className="font-semibold text-lg">
                              {users[1].report_count} Reports
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {/* 1st Place */}
                {users[0] && (
                  <div
                    className="md:order-2 animate-scale-in"
                    style={{ animationDelay: "0ms" }}
                  >
                    <Card className="rounded-3xl border-4 border-yellow-500/50 hover:shadow-xl transition-all hover:-translate-y-3 md:scale-110">
                      <CardContent className="pt-8 text-center">
                        <div className="relative mb-4">
                          <Avatar className="h-28 w-28 mx-auto ring-4 ring-yellow-500/50">
                            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-3xl">
                              {getInitials(users[0].display_name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          <Link to={`/profile/${users[0].user_id}`}>
                            {users[0].display_name}
                          </Link>
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <span className="font-semibold text-xl">
                              {users[0].report_count} Reports
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {/* 3rd Place */}
                {users[2] && (
                  <div
                    className="md:order-3 animate-scale-in"
                    style={{ animationDelay: "200ms" }}
                  >
                    <Card className="rounded-3xl border-4 border-amber-600/50 hover:shadow-xl transition-all hover:-translate-y-2">
                      <CardContent className="pt-8 text-center">
                        <div className="relative mb-4">
                          <Avatar className="h-24 w-24 mx-auto ring-4 ring-amber-600/30">
                            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white text-2xl">
                              {getInitials(users[2].display_name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          <Link to={`/profile/${users[2].user_id}`}>
                            {users[2].display_name}
                          </Link>
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-center">
                            <span className="font-semibold text-lg">
                              {users[2].report_count} Reports
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Rest of Leaderboard */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Top Rankings</h2>
              <div className="space-y-3">
                {users.slice(3).map((user, index) => (
                  <Card
                    key={user.user_id}
                    className="rounded-3xl border-2 hover:shadow-lg transition-all hover:border-primary/50 hover:-translate-x-2 animate-fade-in"
                    style={{ animationDelay: `${(index + 3) * 50}ms` }}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-16 text-center">
                          {getRankIcon(index + 4)}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {getInitials(user.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            <Link to={`/profile/${user.user_id}`}>
                              {user.display_name}
                            </Link>
                          </h3>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {user.report_count}
                            </span>{" "}
                            reports
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;