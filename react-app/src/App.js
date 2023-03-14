import logo from './logo.svg';
import './App.css';


function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<p> this is another header</p>
			</header>
			<footer> <p>hi</p></footer>
		</div>
	);
}

export default App;
