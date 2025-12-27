import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { initSocket } from '../socket.js';
import { ACTIONS } from '../Actions.js';

import Sidebar from '../components/SliderBar.jsx'; 
import CodeEditor from '../components/CodeEditor.jsx';
import Output from '../components/OutPut.jsx';
import ClientList from '../components/ClientList.jsx'; 

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null); 
    const editorRef = useRef(null); 
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    
    // State to store connected clients
    const [clients, setClients] = useState([]);
    const [language, setLanguage] = useState('java');

    // Security Check
    if (!location.state) {
        return <Navigate to="/" />;
    }

    // --- SOCKET CONNECTION LOGIC ---
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listen for Joined Event
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
                
                // Sync code on join
                if (codeRef.current) {
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            });

            // Listen for Disconnect
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter((client) => client.socketId !== socketId);
                });
            });
        };

        init();
        
        // Cleanup
        return () => {
            if(socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    }, []);

    const onCodeChange = (code) => {
        codeRef.current = code;
    };

    // ==========================================
    // 👇 THIS IS THE MISSING FIX FOR DUPLICATES 👇
    // ==========================================
    const uniqueClients = Object.values(
        clients.reduce((acc, client) => {
            acc[client.username] = client;
            return acc;
        }, {})
    );
    // ==========================================

    return (
        <div className="flex h-screen bg-[#0f0a19] text-white overflow-hidden font-sans">
            
            {/* 1. Sidebar */}
            <div className="flex-none h-full">
                {/* Use uniqueClients here */}
                <Sidebar clients={uniqueClients} roomId={roomId}/> 
            </div>

            {/* 2. Main Workspace */}
            <div className="flex-1 flex p-4 gap-4 h-full">
                
                {/* Left: Code Editor */}
                <div className="flex-1 h-full min-w-0">
                    {/* Use uniqueClients here */}
                    <CodeEditor 
                        socketRef={socketRef} 
                        roomId={roomId} 
                        onCodeChange={onCodeChange}
                        language={language}
                        setLanguage={setLanguage}
                        editorRef={editorRef} 
                        clients={uniqueClients}
                    /> 
                </div>

                {/* Right: Live Users + Output (Stacked) */}
                <div className="w-[350px] lg:w-[400px] flex-none h-full flex flex-col gap-4">
                    
                    {/* Top: Live Users List */}
                    <div className="h-[40%] bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                        {/* Use uniqueClients here */}
                        <ClientList clients={uniqueClients} />
                    </div>

                    {/* Bottom: Terminal/Output */}
                    <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                        <Output editorRef={editorRef} language={language} socketRef={socketRef} roomId={roomId}
                        username={location.state?.username} /> 
                    </div>

                </div>

            </div>
        </div>
    );
};

export default EditorPage;