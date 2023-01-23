import { NavLink, Outlet } from 'react-router-dom';
import '../App.scss';

const Overlay = () => {
	return (
		<>
			<NavLink className='home-link' to=''>
				{`<- Home`}
			</NavLink>
			<Outlet />
		</>
	);
};

export default Overlay;
