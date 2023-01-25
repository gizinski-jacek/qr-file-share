import '../App.scss';
import { useRef, useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const Send = () => {
	const [fileData, setFileData] = useState<File | null>();
	const [fileURL, setFileURL] = useState<string | null>();
	const ref = useRef<HTMLInputElement>(null);

	const clickSelectFile = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		ref.current?.click();
	};

	const handleFileSelect = (e: React.ChangeEvent) => {
		e.stopPropagation();
		const target = e.target as HTMLInputElement;
		const file = (target.files as FileList)[0];
		if (file.size > 2000000) {
			alert('File too big');
			return;
		}
		setFileData(file);
	};

	const handleFileUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			if (!fileData) return;
			const profileData = new FormData();
			profileData.append('file', fileData);
			const res = await axios.post(
				`${process.env.REACT_APP_API_URI}/api/send-single-file`,
				profileData
			);
			setFileData(null);
			setFileURL(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='send'>
			<form>
				<label htmlFor='file'>Select file</label>
				<input
					ref={ref}
					id='file'
					name='file'
					type='file'
					onChange={handleFileSelect}
				/>
			</form>
			{fileURL && <QRCodeSVG value={fileURL} />}
			{!fileURL && fileData ? (
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
							stroke-width='2'
							stroke-linecap='round'
							stroke-linejoin='round'
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
							stroke-width='2'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</svg>
				</div>
			)}
			{fileData && <div>File: {fileData.name}</div>}
			<button
				className='send-btn'
				type='button'
				onClick={handleFileUpload}
				disabled={!fileData}
			>
				Send
			</button>
		</div>
	);
};

export default Send;
