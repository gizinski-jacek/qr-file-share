import '../styles/Code.scss';
import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSingleFile } from './Overlay';
import { io } from 'socket.io-client';
import { RemoteFile, SocketType } from '../types';
import { FileIcon } from 'react-file-icon';
import prettyBytes from 'pretty-bytes';

const Code = () => {
	const { dirId } = useParams();
	const [fileList, setFileList] = useState<FileList | null>(null);
	const [fileListErrors, setFileListErrors] = useState<string[] | null>(null);
	const [serverError, setServerError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const ref = useRef<HTMLInputElement>(null);
	const { singleFile } = useSingleFile();
	const [socket, setSocket] = useState<SocketType | null>(null);
	const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);

	useEffect(() => {
		setFileList(null);
		setFileListErrors(null);
	}, [singleFile]);

	useEffect(() => {
		(async () => {
			try {
				if (!dirId || dirId.length !== 6) {
				} else {
					const res = await axios.get(
						`${process.env.REACT_APP_API_URI}/api/code-dir-check/${dirId}`
					);
					console.log(res.data);
					const newSocket = io(
						`${process.env.REACT_APP_API_URI}/notifications`,
						{ query: { code: dirId }, transports: ['websocket'] }
					);
					setRemoteFiles(res.data);
					setSocket(newSocket);
					return () => newSocket.disconnect();
				}
			} catch (error: any) {
				console.error(error.message);
				if (error instanceof AxiosError) {
					setServerError(error.response?.data || 'Unknown server error.');
				} else {
					setServerError('Unknown server error.');
				}
			}
		})();
	}, [dirId]);

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
			setFileListErrors(errors);
			setFileList(null);
			return;
		}
		setFileListErrors(null);
		setFileList(files);
		setSuccess(false);
	};

	const handleFileUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			if (!fileList) return;
			const uploadData = new FormData();
			for (let i = 0; i < fileList.length; i++) {
				uploadData.append('files', fileList[i]);
			}
			await axios.post(
				`${process.env.REACT_APP_API_URI}/api/receive-files/${dirId}`,
				uploadData
			);
			setFileList(null);
			setServerError(null);
			setSuccess(true);
		} catch (error: any) {
			console.error(error.message);
			if (error instanceof AxiosError) {
				setServerError(error.response?.data || 'Unknown server error.');
			} else {
				setServerError('Unknown server error.');
			}
		}
	};

	return !serverError ? (
		<div className='code'>
			<div className='form-container'>
				{fileList ? (
					<div
						className='checkmark-icon'
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
						className='add-icon'
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
				{success && <div>Files uploaded successfully.</div>}
				{fileListErrors && (
					<div className='errors'>
						{fileListErrors.map((error, i) => (
							<div key={i}>{error}</div>
						))}
					</div>
				)}
				{fileList && (
					<>
						<div>Uploading files:</div>
						<div className='upload-list'>
							{Array.from(fileList).map((file, i) => {
								return (
									<div key={i}>
										<FileIcon extension={file.name.slice(-3)} />
										<div>
											<div>{file.name}</div>
											<div>{prettyBytes(file.size)}</div>
										</div>
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
						multiple={!singleFile}
						onChange={handleFileSelect}
					/>
				</form>
				<button
					className='send-btn'
					type='button'
					onClick={handleFileUpload}
					disabled={!fileList || !!fileListErrors}
				>
					Send
				</button>
			</div>
			{remoteFiles.length > 0 && (
				<div className='received-file-list'>
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
			)}
		</div>
	) : (
		<div>{serverError}</div>
	);
};

export default Code;
