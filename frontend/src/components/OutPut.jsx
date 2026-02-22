import React, { useState, useEffect, useRef } from "react";
import { Terminal, MessageSquare, Play, Loader2, Send, Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { executeCode } from "../api";
import { ACTIONS } from "../Actions";
import toast from "react-hot-toast";

// NEW PROPS ADDED: isCallActive, isMicOn, startCall, leaveCall, toggleMic
function OutPut({ editorRef, language, socketRef, roomId, username, isCallActive, isMicOn, startCall, leaveCall, toggleMic }) {
  const [activeTab, setActiveTab] = useState("terminal");
  const [isLoading, setIsLoading] = useState(false);
  const [outputLines, setOutputLines] = useState([{ type: "info", text: '> Ready to compile...' }]);
  
  // Chat States
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.SYNC_OUTPUT, ({ output }) => {
        setOutputLines(output);
        setActiveTab("terminal");
      });

      socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, ({ username, message, time }) => {
        setMessages((prev) => [...prev, { username, message, time, isMe: false }]);
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

  const runCode = async () => {
      // 1. Get the current code from the editor
      const sourceCode = editorRef.current.getValue();
      if (!sourceCode) return;

      try {
          // 2. Set loading state and show "Running..." in terminal
          setIsLoading(true);
          setOutputLines([{ type: "info", text: "> Running code..." }]);
          
          // 3. Call your API to execute the code
          const result = await executeCode(language, sourceCode);
          
          // 4. Format the output (split by newlines for the terminal UI)
          // Note: Adjust 'result.run.output' if your API returns data differently
          const rawOutput = result.run ? result.run.output : result.output || result;
          const outputText = rawOutput.split('\n');
          
          const formattedOutput = outputText.map(line => ({
              type: result.run?.stderr ? "error" : "success",
              text: line
          }));

          // 5. Update my own screen
          setOutputLines(formattedOutput);

          // 6. Broadcast the output to everyone else in the room
          if (socketRef.current) {
              socketRef.current.emit(ACTIONS.SYNC_OUTPUT, {
                  roomId,
                  output: formattedOutput
              });
          }

      } catch (error) {
          console.error("Execution error:", error);
          const errorOutput = [{ 
              type: "error", 
              text: error.message || "Failed to execute code. Check your internet or API." 
          }];
          setOutputLines(errorOutput);
      } finally {
          setIsLoading(false);
      }
  };

  const sendMessage = () => {
      if (!newMessage.trim()) return;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msgData = { roomId, message: newMessage, username, time };
      setMessages((prev) => [...prev, { username, message: newMessage, time, isMe: true }]);
      setNewMessage("");
      socketRef.current.emit(ACTIONS.SEND_MESSAGE, msgData);
  };
  
  // ... Keep handleEnterKey ...

  return (
    <aside className="w-full h-full bg-[#1e1e1e] flex flex-col overflow-hidden">

      {/* Tabs Header */}
      <div className="flex border-b border-gray-800 bg-[#1e1e1e] items-center">
        
        {/* TAB 1: Terminal */}
        <button
          onClick={() => setActiveTab("terminal")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "terminal" ? "text-blue-400 border-b-2 border-blue-500 bg-[#252526]" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Terminal className="w-4 h-4" />
          Terminal
        </button>

        {/* TAB 2: Chat */}
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "chat" ? "text-blue-400 border-b-2 border-blue-500 bg-[#252526]" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>

        {/* 📞 VOICE CALL CONTROLS (Right Aligned) */}
        <div className="ml-auto pr-3 flex items-center gap-2">
            {!isCallActive ? (
                <button 
                    onClick={startCall}
                    title="Start Voice Call"
                    className="p-2 rounded-full bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-all border border-green-600/30"
                >
                    <Phone size={16} />
                </button>
            ) : (
                <div className="flex items-center gap-2 bg-[#252526] p-1 rounded-full border border-gray-700">
                    <button 
                        onClick={toggleMic}
                        className={`p-1.5 rounded-full transition-colors ${isMicOn ? 'text-gray-300 hover:bg-gray-700' : 'bg-red-500/20 text-red-400'}`}
                    >
                        {isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
                    </button>
                    <button 
                        onClick={leaveCall}
                        className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                        <PhoneOff size={14} />
                    </button>
                </div>
            )}
        </div>

      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-hidden bg-[#1e1e1e] relative flex flex-col">
        {/* ... Keep your existing Terminal and Chat UI code here ... */}
        {activeTab === "terminal" && (
            <div className="flex-1 p-4 font-mono text-xs space-y-1 overflow-y-auto custom-scrollbar">
                {outputLines.map((line, index) => (
                    <div key={index} className={`break-words ${line.type === "error" ? "text-red-400" : line.type === "success" ? "text-green-400" : "text-gray-400"}`}>
                        {line.text}
                    </div>
                ))}
            </div>
        )}
        
        {activeTab === "chat" && (
            <div className="flex flex-col h-full">
                {/* Keep Chat UI Code */}
                <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                             <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words ${msg.isMe ? "bg-blue-600/20 text-blue-100" : "bg-[#252526] text-gray-200"}`}>
                                {msg.message}
                             </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-[#1e1e1e] border-t border-gray-800">
                    <div className="flex items-center gap-2 bg-[#252526] rounded-lg px-3 py-2 border border-gray-700">
                        <input type="text" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} className="flex-1 bg-transparent text-sm text-gray-200 focus:outline-none" />
                        <button onClick={sendMessage}><Send size={16} className="text-blue-400"/></button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Run Code Button */}
      {activeTab === "terminal" && (
         <div className="p-4 border-t border-gray-800 bg-[#1e1e1e]">
            {/* ... Keep your existing Run Code Button ... */}
            <button onClick={runCode} className="w-full bg-blue-600 rounded-xl py-3 text-white flex items-center justify-center gap-2">
                <Play size={16}/> Run Code
            </button>
         </div>
      )}

    </aside>
  );
}

export default OutPut;