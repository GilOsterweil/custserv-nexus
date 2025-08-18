import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    activeTickets: 0,
    resolvedToday: 0,
    avgResponseTime: '0 min',
    customerSatisfaction: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    const apiKey = localStorage.getItem('apiKey');
    const userData = localStorage.getItem('user');

    if (!apiKey || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    
    // Fetch dashboard data from your custom backend
    fetchDashboardData(apiKey);
  }, [navigate]);

  const fetchDashboardData = async (apiKey: string) => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('apiKey');
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-backdrop flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      {/* Header */}
      <header className="bg-gradient-card border-b border-primary/10 shadow-soft backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-teal rounded-curve flex items-center justify-center shadow-button">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  Customer Support
                </h1>
                <p className="text-sm text-muted-foreground">Admin Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-base font-semibold text-foreground">
                  {user.name || user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Support Agent
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-bounce rounded-curve"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Welcome back, <span className="bg-gradient-to-r from-primary to-accent-orange bg-clip-text text-transparent">{user.name || 'Admin'}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here's what's happening with customer support today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 animate-slide-in">
          <Card className="shadow-soft border-0 bg-gradient-card rounded-curve-lg hover:scale-105 transition-bounce">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Tickets
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-primary/60" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.activeTickets}
              </div>
              <Badge className="mt-3 bg-accent-orange/10 text-accent-orange border-accent-orange/20 rounded-curve">
                Needs attention
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0 bg-gradient-card rounded-curve-lg hover:scale-105 transition-bounce">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolved Today
              </CardTitle>
              <Users className="h-5 w-5 text-primary/60" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.resolvedToday}
              </div>
              <Badge className="mt-3 bg-green-100 text-green-700 border-green-200 rounded-curve">
                Great work!
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0 bg-gradient-card rounded-curve-lg hover:scale-105 transition-bounce">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Response Time
              </CardTitle>
              <Clock className="h-5 w-5 text-primary/60" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.avgResponseTime}
              </div>
              <Badge className="mt-3 bg-primary/10 text-primary border-primary/20 rounded-curve">
                Within SLA
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0 bg-gradient-card rounded-curve-lg hover:scale-105 transition-bounce">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customer Satisfaction
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary/60" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.customerSatisfaction}%
              </div>
              <Badge className="mt-3 bg-blue-100 text-blue-700 border-blue-200 rounded-curve">
                Excellent
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-soft border-0 bg-gradient-card rounded-curve-lg animate-fade-in">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Common tasks for customer support agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button className="h-24 flex flex-col space-y-3 bg-gradient-teal hover:scale-105 active:scale-95 transition-bounce shadow-button rounded-curve text-lg font-semibold">
                <MessageSquare className="w-8 h-8" />
                <span>View Tickets</span>
              </Button>
              <Button className="h-24 flex flex-col space-y-3 bg-gradient-to-br from-accent-orange to-accent-orange/80 hover:scale-105 active:scale-95 transition-bounce shadow-button rounded-curve text-lg font-semibold text-accent-orange-foreground">
                <Users className="w-8 h-8" />
                <span>Customer Lookup</span>
              </Button>
              <Button className="h-24 flex flex-col space-y-3 bg-gradient-hero hover:scale-105 active:scale-95 transition-bounce shadow-button rounded-curve text-lg font-semibold">
                <TrendingUp className="w-8 h-8" />
                <span>Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;