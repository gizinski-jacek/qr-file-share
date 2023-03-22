import '../styles/Receive.scss';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios, { AxiosError } from 'axios';
import { io } from 'socket.io-client';
import { RemoteFile, SocketType } from '../types';
import { FileIcon } from 'react-file-icon';
import prettyBytes from 'pretty-bytes';

const Receive = () => {
	const [dirId, setDirId] = useState<string | null>(null);
	const [codeError, setCodeError] = useState<string | null>(null);
	const [socket, setSocket] = useState<SocketType | null>(null);
	const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);

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
			setRemoteFiles(data);
		});

		return () => {
			socket.off();
		};
	}, [socket]);

	return !codeError ? (
		<div className='receive'>
			<div className='form-container'>
				{dirId && (
					<div className='qr-code' aria-label='qr code'>
						<QRCodeSVG
							value={`${process.env.REACT_APP_CLIENT_URI}/code/${dirId}`}
						/>
					</div>
				)}
				{dirId && <div className='directory-id'>{dirId}</div>}
			</div>
			{remoteFiles.length > 0 && (
				<div className='uploaded'>
					<h2>Uploaded files:</h2>
					<div className='uploaded-file-list'>
						{remoteFiles.map((file, i) => (
							<div key={i}>
								<a href={file.url} target='_blank' rel='noreferrer'>
									<FileIcon extension={file.extension} />
									<div>
										<div>{file.name}</div>
										<div>{prettyBytes(file.size)}</div>
									</div>
								</a>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	) : (
		<div>{codeError}</div>
	);
};

export default Receive;
