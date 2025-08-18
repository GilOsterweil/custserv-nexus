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
      <header className="bg-admin-surface border-b border-admin-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-admin-text-primary">
                Customer Support Admin
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-admin-text-primary">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-admin-text-secondary">
                  Support Agent
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="transition-all duration-200"
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
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-admin-text-primary mb-2">
            Welcome back, {user.name || 'Admin'}
          </h2>
          <p className="text-admin-text-secondary">
            Here's what's happening with customer support today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-in">
          <Card className="shadow-card border-admin-border bg-gradient-surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-admin-text-secondary">
                Active Tickets
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-admin-text-primary">
                {stats.activeTickets}
              </div>
              <Badge variant="secondary" className="mt-2">
                Needs attention
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-card border-admin-border bg-gradient-surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-admin-text-secondary">
                Resolved Today
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-admin-text-primary">
                {stats.resolvedToday}
              </div>
              <Badge variant="secondary" className="mt-2 bg-green-50 text-green-700 border-green-200">
                Great work!
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-card border-admin-border bg-gradient-surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-admin-text-secondary">
                Avg Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-admin-text-primary">
                {stats.avgResponseTime}
              </div>
              <Badge variant="secondary" className="mt-2">
                Within SLA
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-card border-admin-border bg-gradient-surface">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-admin-text-secondary">
                Customer Satisfaction
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-admin-text-primary">
                {stats.customerSatisfaction}%
              </div>
              <Badge variant="secondary" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                Excellent
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card border-admin-border bg-gradient-surface animate-fade-in">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">Quick Actions</CardTitle>
            <CardDescription className="text-admin-text-secondary">
              Common tasks for customer support agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col space-y-2 bg-gradient-primary hover:opacity-90 transition-all duration-200">
                <MessageSquare className="w-6 h-6" />
                <span>View Tickets</span>
              </Button>
              <Button className="h-20 flex flex-col space-y-2 bg-gradient-primary hover:opacity-90 transition-all duration-200">
                <Users className="w-6 h-6" />
                <span>Customer Lookup</span>
              </Button>
              <Button className="h-20 flex flex-col space-y-2 bg-gradient-primary hover:opacity-90 transition-all duration-200">
                <TrendingUp className="w-6 h-6" />
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