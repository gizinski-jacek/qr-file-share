// import "./styles.scss";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const Receive = () => {
	const [dirId, setDirId] = useState<string>('');

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(
					`${process.env.API_URI}/receive-single-file/${dirId}`
				);
				setDirId(res.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [dirId]);

	return (
		<div className='receive'>
			<h1>Hello receive</h1>
			{dirId && <QRCodeSVG value={`${process.env.CLIENT_URI}/code/${dirId}`} />}
			<div>{dirId}</div>
			<Link to='/'>{'<- Home'}</Link>
		</div>
	);
};

export default Receive;
