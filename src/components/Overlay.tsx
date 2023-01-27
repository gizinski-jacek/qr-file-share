import '../styles/Overlay.scss';
import { useState } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';

interface ContextType {
	singleMode: boolean;
}

const Overlay = () => {
	const [singleMode, setSingleMode] = useState<boolean>(true);

	const setSingle = () => setSingleMode(true);

	const setMultiple = () => setSingleMode(false);

	return (
		<>
			<Outlet context={{ mode: singleMode }} />
			<div className='overlay'>
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
					</div>
					Home
				</NavLink>
				<div className='modes'>
					<button
						className={singleMode ? 'active' : ''}
						type='button'
						onClick={setSingle}
					>
						Single
					</button>
					<button
						className={!singleMode ? 'active' : ''}
						type='button'
						onClick={setMultiple}
					>
						Multiple
					</button>
				</div>
			</div>
		</>
	);
};

export function useSingleMode() {
	return useOutletContext<ContextType>();
}

export default Overlay;
