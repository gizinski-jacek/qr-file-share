import '../App.scss';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const Code = () => {
	const { dirId } = useParams();
	const [fileData, setFileData] = useState<File | null>();
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		(async () => {
			try {
				if (!dirId) return;
				await axios.get(
					`${process.env.REACT_APP_API_URI}/code-dir-check/${dirId}`
				);
			} catch (error) {
				console.log(error);
			}
		})();
	});

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
			await axios.post(
				`${process.env.REACT_APP_API_URI}/api/receive-single-file/${dirId}`,
				profileData
			);
			setFileData(null);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='code'>
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

export default Code;
