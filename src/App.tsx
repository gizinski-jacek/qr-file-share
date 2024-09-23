import './App.scss';
import {
	Routes,
	Route,
	NavLink,
	Navigate,
	useNavigate,
} from 'react-router-dom';
import Send from './components/Send';
import Receive from './components/Receive';
import Code from './components/Code';
import Overlay from './components/Overlay';
import { useState } from 'react';

const App = () => {
	const [input, setInput] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const navigate = useNavigate();

	const handleFormSubmit = (
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
	) => {
		e.preventDefault();
		navigate(`code/${input}`);
	};

	return (
		<div className='app'>
			<Routes>
				<Route
					path=''
					element={
						<div className='home-page'>
							<div className='home-page-links'>
								<NavLink to='send' aria-label='send file'>
									<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
										<path d='M23,13v8a1,1,0,0,1-1,1H2a1,1,0,0,1-1-1V13a1,1,0,0,1,2,0v7H21V13a1,1,0,0,1,2,0ZM12,18a1,1,0,0,0,1-1V5.414l2.293,2.293a1,1,0,0,0,1.414-1.414l-4-4a1,1,0,0,0-1.414,0l-4,4A1,1,0,1,0,8.707,7.707L11,5.414V17A1,1,0,0,0,12,18Z' />
									</svg>
									<div>Send</div>
								</NavLink>
								<NavLink to='receive' aria-label='receive file'>
									<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
										<path d='M7.293,13.707a1,1,0,1,1,1.414-1.414L11,14.586V3a1,1,0,0,1,2,0V14.586l2.293-2.293a1,1,0,0,1,1.414,1.414l-4,4a1,1,0,0,1-.325.216.986.986,0,0,1-.764,0,1,1,0,0,1-.325-.216ZM22,12a1,1,0,0,0-1,1v7H3V13a1,1,0,0,0-2,0v8a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V13A1,1,0,0,0,22,12Z' />
									</svg>
									<div>Receive</div>
								</NavLink>
							</div>
							<form className='home-page-form' onSubmit={handleFormSubmit}>
								<label htmlFor='inputCode'>Enter folder code</label>
								<input
									className={input.length !== 6 ? 'error' : ''}
									id='inputCode'
									type='text'
									minLength={6}
									maxLength={6}
									onChange={handleInputChange}
									value={input}
								></input>
								<span>Folder code, 6 characters long</span>
								<button onClick={handleFormSubmit}>Go to folder</button>
							</form>
						</div>
					}
				/>
				<Route element={<Overlay />}>
					<Route path='send' element={<Send />} />
					<Route path='receive' element={<Receive />} />
					<Route path='code/:dirId' element={<Code />} />
					<Route path='code' element={<Navigate to='/' replace />}></Route>
				</Route>
			</Routes>
		</div>
	);
};

export default App;
