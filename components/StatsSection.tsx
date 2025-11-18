import * as React from "react";
import { useState, useEffect } from "react";
import { FolderGit2, Users, TrendingUp } from "lucide-react";

interface Stats {
  totalProjects: number;
  totalCreators: number;
  activeThisWeek: number;
}

function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return null;
  }

  const statItems = [
    {
      label: "Projects",
      value: stats.totalProjects,
      icon: <FolderGit2 className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Creators",
      value: stats.totalCreators,
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-600",
    },
    {
      label: "Active This Week",
      value: stats.activeThisWeek,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsSection;
