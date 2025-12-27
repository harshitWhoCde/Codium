import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Code,
  User,
  ArrowRight,
  ArrowLeft,
  Code2,
  Hash,
  Copy,
  Shuffle,
  Zap,
  Users,
} from "lucide-react";

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Go back to home
  const onBack = () => {
    navigate("/");
  };

  // Generate new room ID
  const generateRoomId = () => {
    const id = uuidv4().slice(0, 8).toUpperCase();
    setRoomId(id);
    setIsCreatingRoom(true);
    toast.success("New room created!");
  };

  // Copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied!");
  };

  // Handle Join Room
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-950 to-black text-white flex items-center justify-center p-6 overflow-auto">

      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-[12px] hover:bg-white/10 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT PANEL — JOIN FORM */}
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-[12px] border border-white/10 p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-[12px] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl mb-2">Join Coding Room</h1>
              <p className="text-gray-400">
                Enter your details to start collaborating
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-[12px] focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>

              {/* Room ID */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Room ID</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter room ID"
                    className="w-full pl-10 pr-24 py-3 bg-white/5 border border-white/10 rounded-[12px] uppercase"
                    maxLength={8}
                    required
                  />
                  {roomId && (
                    <button
                      type="button"
                      onClick={copyRoomId}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/40 text-gray-500">OR</span>
                </div>
              </div>

              {/* Create New Room */}
              <button
                type="button"
                onClick={generateRoomId}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 border border-purple-500/30 rounded-[12px] hover:bg-purple-600/30"
              >
                <Shuffle className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">Create New Room</span>
              </button>

              {isCreatingRoom && roomId && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-[12px]">
                  <p className="text-sm text-green-400 mb-1">
                    ✓ Room created successfully!
                  </p>
                  <p className="text-xs text-gray-400">
                    Share this Room ID with your team to collaborate
                  </p>
                </div>
              )}

              {/* JOIN BUTTON */}
              <button
                type="submit"
                disabled={!username.trim() || !roomId.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                <span className="text-lg">Join Room</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* RIGHT PANEL — FEATURES + QUICK START */}
          <div className="space-y-6">

            {/* What You Get */}
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-[12px] border border-white/10 p-6">
              <h2 className="text-xl mb-4">What You Get</h2>

              <div className="space-y-4">

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-[12px] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Real-Time Sync</h3>
                    <p className="text-sm text-gray-400">See everyone's edits instantly</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[12px] flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Unlimited Collaborators</h3>
                    <p className="text-sm text-gray-400">Invite your whole team</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-[12px] flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Multiple Languages</h3>
                    <p className="text-sm text-gray-400">JS, Python, C++, Java & more</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl rounded-[12px] border border-blue-500/20 p-6">
              <h3 className="text-lg mb-3 text-blue-300">Quick Start</h3>

              <ol className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-blue-400">1.</span>
                  <span>Enter your name</span>
                </li>

                <li className="flex gap-2">
                  <span className="text-blue-400">2.</span>
                  <span>Create a new room or join existing one</span>
                </li>

                <li className="flex gap-2">
                  <span className="text-blue-400">3.</span>
                  <span>Share Room ID with teammates</span>
                </li>

                <li className="flex gap-2">
                  <span className="text-blue-400">4.</span>
                  <span>Start coding together!</span>
                </li>
              </ol>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
