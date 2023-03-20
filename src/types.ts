import { Socket } from 'socket.io-client';

interface ServerToClientEvents {
	oops: (error: any) => void;
	new_file_alert: (data: any) => void;
}

export type SocketType = Socket<ServerToClientEvents>;

export interface RemoteFile {
	name: string;
	size: number;
	extension: string;
	url: string;
}
