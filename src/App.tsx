import './App.scss';
import { Routes, Route, Link } from 'react-router-dom';
import Send from './components/Send';
import Receive from './components/Receive';
import Code from './components/Code';

const App = () => {
	return (
		<div className='app'>
			<Routes>
				<Route
					path=''
					element={
						<>
							<Link to='send'>SEND</Link>
							<Link to='receive'>RECEIVE</Link>
						</>
					}
				/>
				<Route path='send' element={<Send />} />
				<Route path='receive' element={<Receive />} />
				<Route path='code/:dirId' element={<Code />} />
			</Routes>
		</div>
	);
};

export default App;
