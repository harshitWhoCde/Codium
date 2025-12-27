import React from 'react';

const ClientList = ({ clients }) => {
  
  // ADD THIS LINE: Filter out duplicate usernames
  const uniqueClients = Object.values(
    clients.reduce((acc, client) => {
      acc[client.username] = client;
      return acc;
    }, {})
  );

  return (
    <div className="flex flex-col h-full p-4">
      
      <h3 className="text-gray-400 font-medium text-sm mb-4">Live Users</h3>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {/* Change 'clients.map' to 'uniqueClients.map' */}
        {uniqueClients.map((client) => (
          <div key={client.socketId} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
            
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                {client.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1e1e1e] rounded-full"></div>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">
                {client.username}
              </span>
              <span className="text-xs text-gray-500 font-medium group-hover:text-gray-400">
                Online
              </span>
            </div>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;