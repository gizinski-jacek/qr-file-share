import '../styles/Routes.scss';
import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { RemoteFile, SocketType } from '../types';
import { FileIcon } from 'react-file-icon';
import prettyBytes from 'pretty-bytes';
import { convertMsToCountdown } from '../lib/utils';
import Loading from './Loading';

const Code = () => {
	const { dirId } = useParams();
	const [countdown, setCountdown] = useState<number | null>(null);
	const [fileUploadList, setFileUploadList] = useState<FileList | null>(null);
	const [fileUploadListErrors, setFileUploadListErrors] = useState<
		string[] | null
	>(null);
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const ref = useRef<HTMLInputElement>(null);
	const [socket, setSocket] = useState<SocketType | null>(null);
	const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);
	const navigate = useNavigate();

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
				if (!dirId || dirId.length !== 6) {
					setError(`Invalid code. Redirecting...`);
					const timeout = setTimeout(() => {
						navigate('/');
					}, 3000);
					return () => clearTimeout(timeout);
				} else {
					const res = await axios.get(
						`${process.env.REACT_APP_API_URI}/api/code-dir-check/${dirId}`,
						{ timeout: 15000 }
					);
					const newSocket = io(
						`${process.env.REACT_APP_API_URI}/notifications`,
						{ query: { code: dirId }, transports: ['websocket'] }
					);
					setRemoteFiles(res.data.fileList);
					setCountdown(parseInt(res.data.dirTimeLeft));
					setSocket(newSocket);
					return () => newSocket.disconnect();
				}
			} catch (error: any) {
				console.error(error.message);
				if (error instanceof AxiosError) {
					setError(
						error.response?.data ||
							'Unknown server error. Please try again later.'
					);
				} else {
					setError('Unknown server error. Please try again later.');
				}
			}
		})();
	}, [dirId, navigate]);

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

	const clickSelectFile = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		ref.current?.click();
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const files = e.target.files as FileList;
		const errors: string[] = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (file.size > 2000000) {
				errors.push(`${file.name} file is too big (max. 2Mb)`);
			}
		}
		if (errors.length) {
			setFileUploadListErrors(errors);
			setFileUploadList(null);
			return;
		}
		setFileUploadListErrors(null);
		setFileUploadList(files);
		setSuccess(false);
	};

	const handleFileUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			setFetching(true);
			if (!fileUploadList || !!fileUploadListErrors) return;
			const uploadData = new FormData();
			for (let i = 0; i < fileUploadList.length; i++) {
				uploadData.append('files', fileUploadList[i]);
			}
			await axios.post(
				`${process.env.REACT_APP_API_URI}/api/receive-files/${dirId}`,
				uploadData,
				{ timeout: 15000 }
			);
			setFetching(false);
			setFileUploadList(null);
			setError(null);
			setSuccess(true);
		} catch (error: any) {
			console.error(error.message);
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
	};

	const handleClearList = () => {
		setFileUploadList(null);
	};

	return (
		<div className='container'>
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
			<div className='form-container'>
				{fileUploadList ? (
					<div
						className='status-icon'
						onClick={clickSelectFile}
						aria-label='file selected'
					>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z'
								stroke='#fff'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</div>
				) : (
					<div
						className='status-icon'
						onClick={clickSelectFile}
						aria-label='select file to upload'
					>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M12 8V16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z'
								stroke='#fff'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</div>
				)}
				{success && <h3>Files uploaded successfully.</h3>}
				{fileUploadListErrors && (
					<div className='error-msg'>
						{fileUploadListErrors.map((error, i) => (
							<div key={i}>{error}</div>
						))}
					</div>
				)}
				{fileUploadList && (
					<>
						<h3>Selected files:</h3>
						<div className='file-list'>
							{Array.from(fileUploadList).map((file, i) => {
								return (
									<div className='file' key={i}>
										<div className='file-details'>
											<FileIcon
												extension={file.name.slice(file.name.lastIndexOf('.'))}
											/>
											<span>
												<div>{file.name}</div>
												<div>{prettyBytes(file.size)}</div>
											</span>
										</div>
										<div className='tooltip'>{file.name}</div>
									</div>
								);
							})}
						</div>
					</>
				)}
				<form encType='multipart/form-data'>
					<label htmlFor='file'>Select file</label>
					<input
						ref={ref}
						id='file'
						name='file'
						type='file'
						multiple={true}
						onChange={handleFileSelect}
					/>
				</form>
				<div className='list-controls'>
					<button
						type='button'
						onClick={handleFileUpload}
						disabled={!fileUploadList || !!fileUploadListErrors}
					>
						Send
					</button>
					<button
						type='button'
						onClick={handleClearList}
						disabled={!fileUploadList || !!fileUploadListErrors}
					>
						Clear
					</button>
				</div>
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

export default Code;
