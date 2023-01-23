import './App.scss';
import { Routes, Route, NavLink } from 'react-router-dom';
import Send from './components/Send';
import Receive from './components/Receive';
import Code from './components/Code';
import Overlay from './components/Overlay';

const App = () => {
	return (
		<div className='app'>
			<Routes>
				<Route
					path=''
					element={
						<>
							<NavLink to='send' className='img-link'>
								<img src='' alt='send' />
								<div>SEND</div>
							</NavLink>
							<NavLink to='receive' className='img-link'>
								<img src='' alt='receive' />
								<div>RECEIVE</div>
							</NavLink>
						</>
					}
				/>
				<Route element={<Overlay />}>
					<Route path='send' element={<Send />} />
					<Route path='receive' element={<Receive />} />
					<Route path='code/:dirId' element={<Code />} />
				</Route>
			</Routes>
		</div>
	);
};

export default App;
