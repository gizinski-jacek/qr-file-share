import '../styles/Overlay.scss';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';

interface ContextType {
	singleFile: boolean;
}

const Overlay = () => {
	return (
		<>
			<div className='overlay'>
				<NavLink className='home-link' aria-label='home page link' to=''>
					<svg
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M9.57 5.93018L3.5 12.0002L9.57 18.0702'
							stroke='#fff'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M20.4999 12H3.66992'
							stroke='#fff'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					Home
				</NavLink>
			</div>
			<Outlet />
		</>
	);
};

export function useSingleFile() {
	return useOutletContext<ContextType>();
}

export default Overlay;
