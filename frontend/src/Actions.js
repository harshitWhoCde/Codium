export const ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    SYNC_CODE: 'sync-code',
    LEAVE: 'leave',
    SYNC_OUTPUT: 'sync-output',
    TYPING: 'typing',
    STOP_TYPING: 'stop-typing',
    SEND_MESSAGE: 'send-message',
    RECEIVE_MESSAGE: 'receive-message',
    
    // 👇 NEW CALL EVENTS
    JOIN_CALL: 'join-call',       // User clicked "Start Call"
    LEAVE_CALL: 'leave-call',     // User clicked "Leave Call"
    USER_JOINED_CALL: 'user-joined-call', // Tell others to connect
};