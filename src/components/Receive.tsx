import '../App.scss';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Receive = () => {
	const [dirId, setDirId] = useState<string>('');

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_API_URI}/receive-single-file/${dirId}`
				);
				setDirId(res.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [dirId]);

	// useEffect(() => {
	//   (() => {
	//     // Create socket connection with dirId
	//     // to get notified of uploaded file.
	//     const socket = io();
	//   })();
	// }, [dirId]);

	return (
		<div className='receive'>
			<h1>Hello receive</h1>
			{dirId && (
				<QRCodeSVG
					value={`${process.env.REACT_APP_CLIENT_URI}/code/${dirId}`}
				/>
			)}
			<div>{dirId}</div>
		</div>
	);
};

export default Receive;
