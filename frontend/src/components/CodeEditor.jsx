import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { ChevronDown, Code2 } from 'lucide-react';
import { ACTIONS } from '../Actions';

const LANGUAGES = [
  "javascript",
  "python",
  "java",
  "csharp",
  "php",
  "typescript"
];

const CodeEditor = ({ socketRef, roomId, onCodeChange, language, setLanguage, editorRef, clients }) => { 
  
  const isRemoteUpdate = useRef(false); 
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  // NEW: Store code that arrives before the editor is ready
  const pendingDiff = useRef(null);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    
    // NEW: If we have code waiting, apply it now!
    if (pendingDiff.current) {
        editor.setValue(pendingDiff.current);
        pendingDiff.current = null;
    }
  };

  // Listen for remote changes
  useEffect(() => {
    if (socketRef.current) {
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            
            // 1. If Editor is ready, update it
            if (editorRef.current) {
                if (code !== null) {
                    const currentCode = editorRef.current.getValue();
                    if (code !== currentCode) {
                        isRemoteUpdate.current = true; 
                        editorRef.current.setValue(code);
                        isRemoteUpdate.current = false; 
                    }
                }
            } else {
                // 2. If Editor NOT ready, save it for later (Fixes the race condition)
                pendingDiff.current = code;
            }
        });
    }
    return () => {
        if (socketRef.current) socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const handleEditorChange = (value) => {
    onCodeChange(value);
    if (isRemoteUpdate.current) return;

    if (socketRef.current) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: value,
        });
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-[#1e1e1e]">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-400">
                <Code2 size={18} />
                <span className="text-sm font-medium">Language:</span>
            </div>
            
            <div className="relative">
                <button 
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#252526] hover:bg-[#2a2a2b] rounded-lg border border-gray-700 text-gray-200 text-sm transition-all min-w-[120px] justify-between"
                >
                    <span className="capitalize">{language}</span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-[#252526] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageSelect(lang)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors
                                    ${language === lang ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-[#333333]'}
                                `}
                            >
                                <span className="capitalize">{lang}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        {/* Collaborators List */}
        <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-medium">Collaborators:</span>
            <div className="flex -space-x-2">
                {clients?.map((client) => (
                    <div key={client.socketId} className="relative group">
                        <div 
                            title={client.username}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#1e1e1e] cursor-help"
                        >
                            {client.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 pt-4 relative">
        <Editor
          height="100%"
          language={language} 
          theme="vs-dark"
          onMount={onMount}
          onChange={handleEditorChange} 
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            padding: { top: 10 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;