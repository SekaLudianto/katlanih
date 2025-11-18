import io, { Socket } from 'socket.io-client';
import { EventEmitter } from 'events';
import { ChatMessage, GiftMessage } from './types';

// FIX: The reference to 'vite/client' was removed and a type assertion was added to `import.meta.env`
// to resolve TypeScript errors when a tsconfig.json is not present to provide Vite's client types.
const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || "http://localhost:8081";

// FIX: Refactored to use composition over inheritance for EventEmitter to solve typing issues.
class TikTokSocketManager {
    private socket: Socket | null = null;
    private uniqueId: string | null = null;
    private isManualDisconnect: boolean = false;
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public on(event: string, listener: (...args: any[]) => void): this {
        this.eventEmitter.on(event, listener);
        return this;
    }

    public off(event: string, listener: (...args: any[]) => void): this {
        this.eventEmitter.off(event, listener);
        return this;
    }

    private emit(event: string, ...args: any[]): boolean {
        return this.eventEmitter.emit(event, ...args);
    }

    public connect(uniqueId: string) {
        this.uniqueId = uniqueId;
        this.isManualDisconnect = false;
        this.initSocketConnection();
    }
    
    private initSocketConnection() {
        if (this.socket) {
            this.socket.disconnect();
        }

        if (!this.uniqueId) return;

        this.socket = io(BACKEND_URL);

        this.socket.on('connect', () => {
            console.info("Socket connected, setting uniqueId...");
            this.socket?.emit('setUniqueId', this.uniqueId, { enableExtendedGiftInfo: true });
        });
        
        this.socket.on('tiktokConnected', (state) => {
            console.info('TikTok LIVE connected:', state);
            this.emit('tiktokConnected', state);
        });

        this.socket.on('tiktokDisconnected', (reason) => {
            console.warn('TikTok LIVE disconnected:', reason);
            this.emit('tiktokDisconnected', reason);
        });

        this.socket.on('streamEnd', () => {
            console.warn('The Live stream has ended.');
            this.emit('streamEnd');
        });

        this.socket.on('roomUser', (msg) => this.emit('roomUser', msg));
        this.socket.on('like', (msg) => this.emit('like', msg));
        this.socket.on('chat', (msg: ChatMessage) => this.emit('chat', msg));
        this.socket.on('gift', (msg: GiftMessage) => this.emit('gift', msg));

        // Listener for server-broadcasted simulation events
        this.socket.on('simulation-event', (data: { type: string, payload: any }) => {
            console.log('Received simulation event from server:', data);
            this.emit(data.type, data.payload);
        });
        
        this.socket.on('disconnect', (reason) => {
            console.warn(`Socket disconnected: ${reason}`);
            if (!this.isManualDisconnect) {
                // Unexpected disconnect
                this.emit('tiktokDisconnected', 'Unexpectedly disconnected from server.');
            }
        });
    }

    public disconnect() {
        this.isManualDisconnect = true;
        this.uniqueId = null;
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        console.log("Manual disconnect initiated.");
    }
}

// Export a singleton instance
const tiktokSocket = new TikTokSocketManager();
export default tiktokSocket;