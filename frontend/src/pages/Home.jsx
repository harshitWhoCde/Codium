import React from "react";
import {
  Plus,
  Search,
  Clock,
  Users,
  Code2,
  TrendingUp,
  Folder,
  Star,
  MoreVertical,
  LogOut,
  User,
  Settings,
} from "lucide-react";

export default function Home({ onOpenEditor, onLogout }) {
  const projects = [
    {
      id: 1,
      name: "Monster-Project-v2",
      language: "JavaScript",
      lastEdited: "2 hours ago",
      collaborators: 3,
      status: "active",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "E-Commerce Backend",
      language: "Java",
      lastEdited: "5 hours ago",
      collaborators: 2,
      status: "active",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 3,
      name: "ML Data Pipeline",
      language: "Python",
      lastEdited: "1 day ago",
      collaborators: 4,
      status: "idle",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Mobile App API",
      language: "C++",
      lastEdited: "3 days ago",
      collaborators: 1,
      status: "idle",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const recentActivity = [
    {
      user: "Sarah Chen",
      action: "compiled",
      project: "Monster-Project-v2",
      time: "5 min ago",
      avatar: "SC",
      color: "bg-pink-500",
    },
    {
      user: "Alex Rivera",
      action: "joined",
      project: "E-Commerce Backend",
      time: "15 min ago",
      avatar: "AR",
      color: "bg-cyan-500",
    },
    {
      user: "Jordan Smith",
      action: "updated",
      project: "ML Data Pipeline",
      time: "1 hour ago",
      avatar: "JS",
      color: "bg-purple-500",
    },
    {
      user: "Sarah Chen",
      action: "commented on",
      project: "Monster-Project-v2",
      time: "2 hours ago",
      avatar: "SC",
      color: "bg-pink-500",
    },
  ];

  const stats = [
    { label: "Total Projects", value: "12", icon: Folder, gradient: "from-blue-500 to-cyan-500" },
    { label: "Compilations Today", value: "47", icon: Code2, gradient: "from-green-500 to-emerald-500" },
    { label: "Team Members", value: "8", icon: Users, gradient: "from-pink-500 to-purple-500" },
    { label: "Success Rate", value: "98%", icon: TrendingUp, gradient: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-950 to-black text-white overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="relative z-20 border-b border-white/10 bg-gray-900/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Left Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[12px] flex items-center justify-center shadow-lg">
              <span>DS</span>
            </div>
            <span className="text-xl">DevSync</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-[12px] focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/5 rounded-[12px]">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>

            <button className="p-2 hover:bg-white/5 rounded-[12px]">
              <User className="w-5 h-5 text-gray-400" />
            </button>

            <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-[12px]">
              <LogOut className="w-5 h-5 text-gray-400" />
            </button>
          </div>

        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Welcome back, Developer</h1>
          <p className="text-gray-400">Here's what's happening with your projects today</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-gray-900/40 rounded-[12px] border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-[12px] flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Projects + Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-gray-900/40 border border-white/10 rounded-[12px]">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl">Your Projects</h2>

                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[12px]">
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 bg-white/5 border border-white/5 rounded-[12px] hover:bg-white/10 cursor-pointer transition-all"
                    onClick={onOpenEditor}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${project.color} rounded-[12px] flex items-center justify-center`}>
                          <Code2 className="w-5 h-5 text-white" />
                        </div>

                        <div>
                          <h3 className="hover:text-blue-400 transition-colors">{project.name}</h3>
                          <p className="text-sm text-gray-500">{project.language}</p>
                        </div>
                      </div>

                      <button className="p-2 hover:bg-white/10 rounded-[12px] transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {project.lastEdited}
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.collaborators} collaborators
                      </div>

                      <div className="flex-1"></div>

                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          project.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="p-6 bg-gray-900/40 border border-white/10 rounded-[12px]">
              <h2 className="text-xl mb-6">Recent Activity</h2>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center text-xs text-white`}>
                      {activity.avatar}
                    </div>

                    <div>
                      <p className="text-sm">
                        <span className="text-white">{activity.user}</span>{" "}
                        <span className="text-gray-400">{activity.action} </span>
                        <span className="text-blue-400">{activity.project}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-gray-900/40 border border-white/10 rounded-[12px]">
              <h2 className="text-xl mb-6">Quick Actions</h2>

              <div className="space-y-3">
                <button className="w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  Start New Session
                </button>

                <button className="w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  Invite Team Member
                </button>

                <button className="w-full p-3 bg-white/5 rounded-[12px] hover:bg-white/10 flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  View Templates
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
