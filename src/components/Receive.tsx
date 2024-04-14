import '../styles/Routes.scss';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios, { AxiosError } from 'axios';
import { io } from 'socket.io-client';
import { RemoteFile, SocketType } from '../types';
import { FileIcon } from 'react-file-icon';
import prettyBytes from 'pretty-bytes';

const Receive = () => {
	const [dirId, setDirId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
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
					setError(error.response?.data || 'Unknown server error.');
				} else {
					setError('Unknown server error.');
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

	return !error ? (
		<div className='container'>
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
				<div className='server'>
					<h3>Uploaded files:</h3>
					<div className='file-list'>
						{remoteFiles.map((file, i) => (
							<div className='file' key={i}>
								<a
									href={file.url}
									className='file-details'
									target='_blank'
									rel='noreferrer'
								>
									<FileIcon extension={file.extension} />
									<span>
										<div>{file.name}</div>
										<div>{prettyBytes(file.size)}</div>
									</span>
								</a>
								<span className='tooltip'>{file.name}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	) : (
		<div>{error}</div>
	);
};

export default Receive;
