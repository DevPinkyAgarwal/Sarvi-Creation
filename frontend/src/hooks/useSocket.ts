import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5003';

export const useSocket = (onStatsUpdate?: (data: any) => void) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socketRef.current.on('connect', () => {
            console.log('🔌 Connected to Socket.io server');
        });

        if (onStatsUpdate) {
            socketRef.current.on('statsUpdate', (data) => {
                console.log('📊 Stats update received via Socket:', data);
                onStatsUpdate(data);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log('🔌 Disconnected from Socket.io server');
            }
        };
    }, [onStatsUpdate]);

    return socketRef.current;
};
