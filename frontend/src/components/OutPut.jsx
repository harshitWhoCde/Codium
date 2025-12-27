import React, { useState, useEffect, useRef } from "react";
import { Terminal, MessageSquare, Play, Loader2, Send } from "lucide-react";
import { executeCode } from "../api";
import { ACTIONS } from "../Actions";
import toast from "react-hot-toast";

function OutPut({ editorRef, language, socketRef, roomId, username }) {
  const [activeTab, setActiveTab] = useState("terminal");
  const [isLoading, setIsLoading] = useState(false);
  const [outputLines, setOutputLines] = useState([{ type: "info", text: '> Ready to compile...' }]);
  
  // CHAT STATES
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  // 1. LISTEN FOR EVENTS (Output & Chat)
  useEffect(() => {
    if (socketRef.current) {
      // Listen for Code Output
      socketRef.current.on(ACTIONS.SYNC_OUTPUT, ({ output }) => {
        setOutputLines(output);
        setActiveTab("terminal");
      });

      // Listen for Chat Messages
      socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, ({ username, message, time }) => {
        setMessages((prev) => [...prev, { username, message, time, isMe: false }]);
        // Optional: Show a toast or notification dot if in another tab
        if (activeTab !== "chat") toast(`${username}: ${message}`, { icon: '💬' });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.SYNC_OUTPUT);
        socketRef.current.off(ACTIONS.RECEIVE_MESSAGE);
      }
    };
  }, [socketRef.current, activeTab]);

  // Auto-scroll chat to bottom
  useEffect(() => {
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
  }, [messages, activeTab]);


  // 2. RUN CODE FUNCTION
  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const runningMsg = [{ type: "info", text: `> Running ${language} code...` }];
      setOutputLines(prev => [...prev, ...runningMsg]); 

      const { run: result } = await executeCode(language, sourceCode);

      let newLines = [];
      if (result.stderr) {
         newLines = result.stderr.split('\n').map(line => ({ type: "error", text: line }));
         newLines.push({ type: "error", text: "✗ Execution Failed" });
      } else {
         newLines = result.output.split('\n').map(line => ({ type: "success", text: line }));
         newLines.push({ type: "info", text: "✓ Execution Complete" });
      }

      const finalOutput = [...outputLines, ...runningMsg, ...newLines];
      setOutputLines(finalOutput); 

      if (socketRef.current) {
          socketRef.current.emit(ACTIONS.SYNC_OUTPUT, { roomId, output: finalOutput });
      }

    } catch (error) {
      toast.error("Execution failed");
      setOutputLines(prev => [...prev, { type: "error", text: `✗ Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. SEND MESSAGE FUNCTION
  const sendMessage = () => {
      if (!newMessage.trim()) return;

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msgData = { roomId, message: newMessage, username, time };

      // Optimistic UI Update (Show my message instantly)
      setMessages((prev) => [...prev, { username, message: newMessage, time, isMe: true }]);
      setNewMessage("");

      // Send to server
      socketRef.current.emit(ACTIONS.SEND_MESSAGE, msgData);
  };

  const handleEnterKey = (e) => {
      if (e.key === 'Enter') sendMessage();
  };

  return (
    <aside className="w-full h-full bg-[#1e1e1e] flex flex-col overflow-hidden">

      {/* Tabs Header */}
      <div className="flex border-b border-gray-800 bg-[#1e1e1e]">
        <button
          onClick={() => setActiveTab("terminal")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "terminal" ? "text-blue-400 border-b-2 border-blue-500 bg-[#252526]" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Terminal className="w-4 h-4" />
          Terminal
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "chat" ? "text-blue-400 border-b-2 border-blue-500 bg-[#252526]" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-hidden bg-[#1e1e1e] relative flex flex-col">
        
        {/* TAB 1: TERMINAL */}
        {activeTab === "terminal" && (
          <div className="flex-1 p-4 font-mono text-xs space-y-1 overflow-y-auto custom-scrollbar">
            {outputLines.map((line, index) => (
              <div key={index} className={`break-words ${line.type === "error" ? "text-red-400" : line.type === "success" ? "text-green-400" : "text-gray-400"}`}>
                 {line.type === "error" && "✗ "} {line.type === "success" && "➜ "} {line.text}
              </div>
            ))}
            <div className="flex items-center mt-2">
              <span className="text-blue-500">$</span>
              <span className="ml-2 w-2 h-4 bg-blue-500 animate-pulse"></span>
            </div>
          </div>
        )}

        {/* TAB 2: CHAT UI */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            {/* Messages List */}
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                {messages.length === 0 && (
                    <div className="text-gray-500 text-center text-sm mt-10">No messages yet. Start the conversation!</div>
                )}
                
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className={`text-xs font-bold ${msg.isMe ? "text-blue-400" : "text-purple-400"}`}>{msg.username}</span>
                            <span className="text-[10px] text-gray-500">{msg.time}</span>
                        </div>
                        <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words ${
                            msg.isMe 
                            ? "bg-blue-600/20 text-blue-100 rounded-tr-none border border-blue-500/30" 
                            : "bg-[#252526] text-gray-200 rounded-tl-none border border-gray-700"
                        }`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#1e1e1e] border-t border-gray-800">
                <div className="flex items-center gap-2 bg-[#252526] rounded-lg px-3 py-2 border border-gray-700 focus-within:border-blue-500 transition-colors">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleEnterKey}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-sm text-gray-200 focus:outline-none placeholder-gray-500"
                    />
                    <button onClick={sendMessage} className="p-1.5 hover:bg-gray-700 rounded-md transition-colors text-blue-400">
                        <Send size={16} />
                    </button>
                </div>
            </div>
          </div>
        )}

      </div>

      {/* Run Button (Only visible on Terminal tab to save space?) 
          Actually, let's keep it global but maybe hide it if Chat is open to give more space?
          For now, I'll leave it at the bottom.
      */}
      {activeTab === "terminal" && (
        <div className="p-4 border-t border-gray-800 bg-[#1e1e1e]">
            <button 
                onClick={runCode}
                disabled={isLoading}
                className="w-full group relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-xl py-3 shadow-lg overflow-hidden transition-all duration-300 disabled:opacity-50"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white"/> : <Play className="w-5 h-5 fill-white text-white" />}
                    <span className="text-white font-medium tracking-wide">{isLoading ? "Compiling..." : "Run Code"}</span>
                </div>
            </button>
        </div>
      )}

    </aside>
  );
}

export default OutPut;