import React from 'react'
import Login from "./components/Login"
import Home from "./components/Home"
import Dashboard from "./components/Dashboard"
import AddVideo from "./components/AddVideo"
import Video from "./components/Video"
import Error from "./components/Error"
import SearchVideo from './components/SearchVideo'

import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

function App() {
	return (
		<>
			<Router>
				<Switch>
					<Route path="/login" exact>
						<Login />
					</Route>
					<Route path="/dashboard" exact>
						<Dashboard />
					</Route>
					<Route path="/addvideo" exact>
						<AddVideo />
					</Route>
					<Route path="/" exact>
						<Home />
					</Route>
					<Route path="/404" exact>
						<Error />
					</Route>
					<Route path="/search" exact>
						<SearchVideo />
					</Route>
					<Switch>
						<Route path="/videos/:id" children={<Video />} />
					</Switch>
				</Switch>
			</Router>
		</>
	)
}

export default App
