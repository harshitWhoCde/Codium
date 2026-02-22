import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { initSocket } from '../socket.js';
import { ACTIONS } from '../Actions.js';
import Peer from 'peerjs';

import Sidebar from '../components/SliderBar.jsx'; 
import CodeEditor from '../components/CodeEditor.jsx';
import Output from '../components/OutPut.jsx';
import ClientList from '../components/ClientList.jsx'; 
import AudioPlayer from '../components/AudioPlayer.jsx'; 

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null); 
    const editorRef = useRef(null); 
    const peerRef = useRef(null); 
    
    // 👇 NEW: Ref to keep track of stream inside socket listeners
    const streamRef = useRef(null);

    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    
    const [clients, setClients] = useState([]);
    const [language, setLanguage] = useState('java');
    const [isSocketInitialized, setSocketInitialized] = useState(false);
    
    // CALL STATE
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [myStream, setMyStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({}); 

    if (!location.state) return <Navigate to="/" />;

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            setSocketInitialized(true);
            
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            // Normal Room Join
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listen for Standard Events
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                    if (codeRef.current) {
                        socketRef.current.emit(ACTIONS.SYNC_CODE, {
                            code: codeRef.current,
                            socketId,
                        });
                    }
                }
                setClients(clients);
            });

            // 📞 LISTEN FOR CALL EVENTS
            socketRef.current.on(ACTIONS.USER_JOINED_CALL, ({ peerId, username: callerName }) => {
                // 👇 FIX: Use streamRef.current instead of myStream
                // The 'myStream' state is stale (null) inside this listener, but the Ref is fresh!
                const currentStream = streamRef.current;
                
                if (peerRef.current && currentStream) {
                    console.log(`📞 Calling new user: ${callerName}`); // Log for debugging
                    const call = peerRef.current.call(peerId, currentStream);
                    
                    call.on('stream', (userAudioStream) => {
                        console.log(`🔊 Receiving audio from ${callerName}`);
                        setRemoteStreams(prev => ({ ...prev, [peerId]: userAudioStream }));
                    });
                } else {
                    console.log("⚠️ Cannot call: Peer or Stream missing", { 
                        peer: !!peerRef.current, 
                        stream: !!currentStream 
                    });
                }
            });

            socketRef.current.on(ACTIONS.LEAVE_CALL, ({ socketId }) => {
                 // Optional: Remove remote stream if needed
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter((client) => client.socketId !== socketId));
            });
        };

        init();
        
        return () => {
            leaveCall(); // Cleanup on unmount
            if(socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    // --- CALL FUNCTIONS ---

    const startCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            
            // 👇 UPDATE BOTH STATE AND REF
            setMyStream(stream);
            streamRef.current = stream; // Keep ref in sync
            
            setIsCallActive(true);

            // ✅ USE PEERJS CLOUD (No host/port)
            const peer = new Peer(); 
            peerRef.current = peer;

            peer.on('open', (id) => {
                console.log("✅ My Peer ID:", id);
                socketRef.current.emit(ACTIONS.JOIN_CALL, { roomId, peerId: id });
            });

            peer.on('call', (call) => {
                console.log("📞 Receiving call from:", call.peer);
                call.answer(stream); // Answer with my stream
                call.on('stream', (remoteStream) => {
                    console.log("🔊 Call connected, receiving audio.");
                    setRemoteStreams(prev => ({ ...prev, [call.peer]: remoteStream }));
                });
            });

        } catch (err) {
            console.error("Failed to get audio", err);
            toast.error("Could not access microphone");
        }
    };

    const leaveCall = () => {
        // Cleanup Audio Stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setMyStream(null);
        }
        
        // Cleanup Peer Connection
        if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
        }
        
        // Safety Check for Socket
        if (socketRef.current) {
            socketRef.current.emit(ACTIONS.LEAVE_CALL, { roomId });
        }
        
        setIsCallActive(false);
        setRemoteStreams({});
    };

    const toggleMic = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

    const onCodeChange = (code) => { codeRef.current = code; };

    const uniqueClients = Object.values(
        clients.reduce((acc, client) => {
            acc[client.username] = client;
            return acc;
        }, {})
    );

    if (!isSocketInitialized) return <div className="text-white">Loading...</div>;

    return (
        <div className="flex h-screen bg-[#0f0a19] text-white overflow-hidden font-sans">
            
            {/* INVISIBLE AUDIO PLAYERS */}
            <div>
                {Object.values(remoteStreams).map((stream, index) => (
                    <AudioPlayer key={index} stream={stream} />
                ))}
            </div>

            <div className="flex-none h-full">
                <Sidebar clients={uniqueClients} roomId={roomId}/> 
            </div>

            <div className="flex-1 flex p-4 gap-4 h-full">
                <div className="flex-1 h-full min-w-0">
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

                <div className="w-[350px] lg:w-[400px] flex-none h-full flex flex-col gap-4">
                    <div className="h-[40%] bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                        <ClientList clients={uniqueClients} />
                    </div>
                    <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                        <Output 
                            editorRef={editorRef} 
                            language={language} 
                            socketRef={socketRef} 
                            roomId={roomId}
                            username={location.state?.username} 
                            isCallActive={isCallActive}
                            isMicOn={isMicOn}
                            startCall={startCall}
                            leaveCall={leaveCall}
                            toggleMic={toggleMic}
                        /> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;