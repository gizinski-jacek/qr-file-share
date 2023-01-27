import '../styles/Receive.scss';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios, { AxiosError } from 'axios';
import { io } from 'socket.io-client';

const Receive = () => {
	const [dirId, setDirId] = useState<string | null>(null);
	const [codeError, setCodeError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_API_URI}/api/receive-files`
				);
				setDirId(res.data);
			} catch (error: any) {
				console.log(error);
				setDirId(null);
				if (error instanceof AxiosError) {
					setCodeError(error.message);
				} else {
					setCodeError('Unknown server error.');
				}
			}
		})();
	}, []);

	// useEffect(() => {
	//   (() => {
	//     // Create socket connection with dirId
	//     // to get notified of uploaded file.
	//     const socket = io();
	//   })();
	// }, [dirId]);

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
