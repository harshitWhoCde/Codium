
import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    
    // IMPORTANT: Make sure this PORT matches your Server PORT
    // If your server says "Listening on 5001", change this to 5001.
    return io('http://localhost:5000', options);
};