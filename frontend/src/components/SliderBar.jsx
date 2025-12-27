import React from 'react';
import { Folder, Users, Settings, Github, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-20 h-full bg-[#1e1e1e] flex flex-col items-center py-6 border-r border-gray-800">
      
      {/* 1. The Logo (Top) */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-105 transition-transform">
           <span className="text-white font-bold font-mono text-lg">DS</span>
        </div>
        <span className="text-[10px] text-gray-500 font-bold mt-2 block text-center tracking-wider">DevSync</span>
      </div>

      {/* 2. Navigation Icons (Middle) */}
      <div className="flex flex-col gap-6 flex-1 w-full px-4">
        <NavIcon icon={<Folder size={22} />} label="Files" active />
        <NavIcon icon={<Users size={22} />} label="Team" />
        <NavIcon icon={<Settings size={22} />} label="Settings" />
        <div className="mt-auto">
             <NavIcon icon={<Github size={22} />} label="GitHub" />
        </div>
      </div>

      {/* 3. Logout (Bottom) */}
      <div className="mt-auto mb-4">
        <button className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut size={20} />
        </button>
      </div>

    </div>
  );
};

// Helper Component for the Icons
const NavIcon = ({ icon, label, active }) => (
    <div className="relative group flex justify-center">
        <button className={`p-3 rounded-xl transition-all ${active ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}>
            {icon}
        </button>
        {/* Tooltip */}
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
            {label}
        </span>
    </div>
);

export default Sidebar;