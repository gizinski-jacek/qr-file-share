import '../styles/Routes.scss';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios, { AxiosError } from 'axios';
import { io } from 'socket.io-client';
import { RemoteFile, SocketType } from '../types';
import { FileIcon } from 'react-file-icon';
import prettyBytes from 'pretty-bytes';
import { NavLink } from 'react-router-dom';
import { convertMsToCountdown } from '../lib/utils';
import Loading from './Loading';

const Receive = () => {
	const [dirId, setDirId] = useState<string | null>(null);
	const [countdown, setCountdown] = useState<number | null>(null);
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [socket, setSocket] = useState<SocketType | null>(null);
	const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (countdown && countdown > 0) {
				setCountdown(countdown - 1000);
			}
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, [countdown]);

	useEffect(() => {
		(async () => {
			try {
				setFetching(true);
				const res = await axios.get(
					`${process.env.REACT_APP_API_URI}/api/receive-files`,
					{ timeout: 15000 }
				);
				const newSocket = io(`${process.env.REACT_APP_API_URI}/notifications`, {
					query: { code: res.data.dirCode },
				});
				setFetching(false);
				setDirId(res.data.dirCode);
				setCountdown(parseInt(res.data.dirTimeLeft));
				setSocket(newSocket);
				return () => {
					newSocket.disconnect();
				};
			} catch (error: any) {
				console.error(error.message);
				setDirId(null);
				if (error instanceof AxiosError) {
					setError(
						error.response?.data ||
							'Unknown server error. Please try again later.'
					);
				} else {
					setError('Unknown server error. Please try again later.');
				}
				setFetching(false);
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

	return (
		<div className='container'>
			<div className='form-container'>
				{dirId && (
					<>
						{countdown !== null ? (
							<div className='countdown'>
								{countdown > 0 ? (
									<>
										<h3>Folder will be deleted in: </h3>
										<span>{convertMsToCountdown(countdown)}</span>{' '}
									</>
								) : (
									<h3>Folder has been deleted.</h3>
								)}
							</div>
						) : null}
						<div className='qr-code' aria-label='qr code'>
							<QRCodeSVG
								value={`${process.env.REACT_APP_CLIENT_URI}/code/${dirId}`}
							/>
						</div>
						<NavLink
							className='folder-link'
							to={`../code/${dirId}`}
							aria-label='go to folder'
						>
							<h3>Go to your folder:</h3>
							<span>{dirId}</span>
						</NavLink>
					</>
				)}
				{fetching && <Loading width='25%' />}
				{error && <div className='error-msg'>{error}</div>}
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
	);
};

export default Receive;
