import '../styles/Routes.scss';
import { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { RemoteFile } from '../types';
import { FileIcon } from 'react-file-icon';
import prettyBytes from 'pretty-bytes';
import { NavLink } from 'react-router-dom';
import { convertMsToCountdown } from '../lib/utils';

const Send = () => {
	const [dirId, setDirId] = useState<string | null>(null);
	const [dirTimer, setDirTimer] = useState<number | null>(null);
	const [countdown, setCountdown] = useState<number | null>(null);
	const [fileUploadList, setFileUploadList] = useState<FileList | null>(null);
	const [fileUploadListErrors, setFileUploadListErrors] = useState<
		string[] | null
	>(null);
	const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const timer = setInterval(() => {
			if (dirTimer) {
				const time = dirTimer - Date.now();
				if (time < 0) {
					setCountdown(null);
				} else {
					setCountdown(time);
				}
			}
		}, 500);

		return () => {
			clearInterval(timer);
		};
	}, [dirTimer]);

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
			setFileUploadList(null);
			setFileUploadListErrors(errors);
			return;
		}
		setFileUploadListErrors(null);
		setFileUploadList(files);
		setSuccess(false);
	};

	const handleFileUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			if (!fileUploadList || !!fileUploadListErrors) return;
			const uploadData = new FormData();
			for (let i = 0; i < fileUploadList.length; i++) {
				uploadData.append('files', fileUploadList[i]);
			}
			const res = await axios.post(
				`${process.env.REACT_APP_API_URI}/api/send-files`,
				uploadData
			);
			setRemoteFiles(res.data.fileList);
			setDirId(res.data.dirCode);
			setDirTimer(parseInt(res.data.dirDeleteTime));
			setCountdown(res.data.dirDeleteTime - Date.now());
			setFileUploadList(null);
			setError(null);
			setSuccess(true);
		} catch (error: any) {
			console.error(error.message);
			if (error instanceof AxiosError) {
				setError(error.response?.data || 'Unknown server error.');
			} else {
				setError('Unknown server error.');
			}
		}
	};

	const handleClearList = () => {
		setFileUploadList(null);
	};

	return !error ? (
		<div className='container'>
			{dirTimer && (
				<div className='countdown'>
					{countdown ? (
						<h3>
							This folder will be deleted in:{' '}
							<span>{convertMsToCountdown(countdown)}</span>
						</h3>
					) : (
						<h3>Folder has been deleted.</h3>
					)}
				</div>
			)}
			{success && dirId && (
				<div className='notification'>
					<h3>Files uploaded successfully.</h3>
					<NavLink
						className='folder-link'
						to={`../code/${dirId}`}
						aria-label='go to folder'
					>
						<h3>Go to your folder:</h3>
						<span>{dirId}</span>
					</NavLink>
				</div>
			)}
			{remoteFiles.length > 0 ? (
				<div className='qr-code-list'>
					{remoteFiles.map((file, i) => (
						<div key={i}>
							<div className='qr-code' aria-label='qr code'>
								<QRCodeSVG value={file.url} />
							</div>
							<div className='file'>
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
								<div className='tooltip'>{file.name}</div>
							</div>
						</div>
					))}
				</div>
			) : (
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
					{fileUploadListErrors && (
						<div className='error'>
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
													extension={file.name.slice(
														file.name.lastIndexOf('.')
													)}
												/>
												<span>
													<div>{file.name}</div>
													<div>{prettyBytes(file.size)}</div>
												</span>
												<span className='tooltip'>{file.name}</span>
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
				</div>
			)}
		</div>
	) : (
		<div className='error'>{error}</div>
	);
};

export default Send;
