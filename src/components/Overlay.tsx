import { NavLink, Outlet } from 'react-router-dom';
import '../App.scss';

const Overlay = () => {
	return (
		<>
			<NavLink className='home-link' to=''>
				<div className='arrow-icon' aria-label='home page link'>
					<svg
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M9.57 5.93018L3.5 12.0002L9.57 18.0702'
							stroke='#fff'
							stroke-width='2'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
						<path
							d='M20.4999 12H3.66992'
							stroke='#fff'
							stroke-width='2'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</svg>
				</div>
				Home
			</NavLink>
			<Outlet />
		</>
	);
};

export default Overlay;
