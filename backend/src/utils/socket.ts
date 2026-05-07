import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: [
                process.env.FRONTEND_URL || 'http://localhost:5173',
                process.env.ADMIN_URL || 'http://localhost:5174',
                'http://localhost:5175'
            ],
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket: any) => {
        console.log('🔌 Client connected to Socket.io:', socket.id);

        socket.on('disconnect', () => {
            console.log('🔌 Client disconnected from Socket.io');
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

export const emitStatsUpdate = (data?: any) => {
    if (io) {
        io.emit('statsUpdate', data || { timestamp: new Date() });
    }
};
