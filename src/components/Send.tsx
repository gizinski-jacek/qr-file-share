import '../App.scss';
import { useRef, useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const Send = () => {
	const [fileData, setFileData] = useState<File | null>();
	const [fileURL, setFileURL] = useState<string | null>();
	const ref = useRef<HTMLInputElement>(null);

	const clickSelectFile = (e: React.MouseEvent<HTMLImageElement>) => {
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
				`${process.env.REACT_APP_API_URI_DEV}/api/send-single-file`,
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
			{fileURL && <QRCodeSVG value={fileURL} />}
			<img src='' alt='select file' onClick={clickSelectFile} />
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
			<button type='button' onClick={handleFileUpload}>
				send
			</button>
		</div>
	);
};

export default Send;
