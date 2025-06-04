
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Wrench, Database, Rss } from 'lucide-react';
import { getDashboardStats } from '@/api/stats';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growth?: string;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, growth, positive }) => {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-1 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {growth && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={positive ? "text-green-500" : "text-red-500"}>
              {positive ? '↑' : '↓'} {growth}
            </span>{' '}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const StatsCard: React.FC = () => {
  const [stats, setStats] = useState({
    prompts: 0,
    tools: 0,
    mcpComponents: 0,
    intelligenceArticles: 0
  });

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((error) => console.error('Error fetching dashboard stats:', error));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Prompts"
        value={stats.prompts}
        icon={<BookOpen className="h-4 w-4" />}
      />
      <StatCard
        title="Tools Documented"
        value={stats.tools}
        icon={<Wrench className="h-4 w-4" />}
      />
      <StatCard
        title="MCP Components"
        value={stats.mcpComponents}
        icon={<Database className="h-4 w-4" />}
      />
      <StatCard
        title="Intelligence Articles"
        value={stats.intelligenceArticles}
        icon={<Rss className="h-4 w-4" />}
      />
    </div>
  );
};

export default StatsCard;
