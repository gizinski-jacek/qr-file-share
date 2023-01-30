import '../styles/Receive.scss';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios, { AxiosError } from 'axios';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';

export type SocketType = Socket<ServerToClientEvents>;

interface ServerToClientEvents {
	oops: (error: any) => void;
	new_file_alert: (data: {}) => void;
}

const Receive = () => {
	const [dirId, setDirId] = useState<string | null>(null);
	const [codeError, setCodeError] = useState<string | null>(null);
	const [socket, setSocket] = useState<SocketType | null>(null);
	const [fileList, setFileList] = useState<{} | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_API_URI}/api/receive-files`
				);
				const newSocket = io(`${process.env.REACT_APP_API_URI}/notifications`, {
					query: { code: res.data },
				});

				setDirId(res.data);
				setSocket(newSocket);

				return () => {
					newSocket.disconnect();
				};
			} catch (error: any) {
				console.error(error.message);
				setDirId(null);
				if (error instanceof AxiosError) {
					setCodeError(error.response?.data || 'Unknown server error.');
				} else {
					setCodeError('Unknown server error.');
				}
			}
		})();
	}, []);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on('oops', (error) => {
			console.error(error);
		});

		socket.on('new_file_alert', (data) => {
			setFileList(data);
		});

		return () => {
			socket.off();
		};
	}, [socket]);

	return !codeError ? (
		<div className='receive'>
			{dirId && (
				<div className='qr-code' aria-label='qr code'>
					<QRCodeSVG
						value={`${process.env.REACT_APP_CLIENT_URI}/code/${dirId}`}
					/>
				</div>
			)}
			{dirId && <div className='dirId-div'>{dirId}</div>}
		</div>
	) : (
		<div>{codeError}</div>
	);
};

export default Receive;
