import React from 'react';
import { TextField, Button } from '@material-ui/core';
import ReactDOM from 'react-dom/client';

// let name = '';
// let id = 0;
// let points = 0;


export class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = { suggestion: "" }

		this.nameListener = this.nameListener.bind(this);
		this.idListener = this.idListener.bind(this);
		this.pointsListener = this.pointsListener.bind(this);
	}


	nameListener = (event) => {
		this.name = event.target.value;
	}
	idListener = (event) => {
		this.id = event.target.value;
	}
	pointsListener = (event) => {
		this.points = event.target.value;
	}

	componentDidMount() {
		// For initial data
		// this.fetchData();
	}

	fetchData = () => {
		if (this.name === undefined) {
			return;
		}
		console.log(`name: ${this.name}, id: ${this.id}, points: ${this.points}`)
		fetch(`http://localhost:5000/search?user=${this.name}`, {
			method: "GET",
			dataType: "JSON",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
		})
			.then((resp) => {
				return resp.json();
			})
			.then((data) => {
				if (data.status === 200) {
					this.response = '200 response';
				}
				else if (data.status === 404) {
					this.response = 'User not found';
				}
				this.name = data.name
				this.id = data.id
				this.points = data.points
				this.setState({ suggestion: data.suggestion })
			})
			.catch((error) => {
				console.log(error, "catch the hoop")
			})
	}

	postData = () => {
		// make sure all fields are filled to be able to request a new user
		if (this.name === undefined || this.id === undefined || this.points === undefined || this.name === '' || this.id === '' || this.points === '') {
			console.log(`one of name, id, points is undefined`);
			return;
		}
		console.log(`name: ${this.name}, id: ${this.id}, points: ${this.points}`)
		console.log(`type name: ${typeof (this.name)}, type id: ${typeof (this.id)}, type points: ${typeof (this.points)}`)

		// hit the API endpoint
		fetch("http://localhost:5000/create", {
			method: "POST",
			dataType: "JSON",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ 'person_id': this.id, 'name': this.name, 'points': this.points })
		}).then((resp) => {
			this.response = resp.status;
			return resp.json();
		}).then((data) => {
			if (data.status === 200) {
				this.response = 'User created successfully';
			}
			this.setState({ suggestion: data.status });
		})
			.catch((error) => {
				console.log(error, "something went wrong creating a person");
			})
	}

	deleteData = () => {
		console.log(`name: ${this.name}, id: ${this.id}, points: ${this.points}`)
		if (this.name === undefined) {
			return;
		}
		fetch("http://localhost:5000/delete", {
			method: "DELETE",
			dataType: "JSON",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ 'name': this.name })
		}).then((resp) => {
			return resp.json();
		}).then((data) => {

			if (data.status === 200) {
				this.response = 'Deleted user successfully';
			}
			else if (data.status === 404) {
				this.response = 'User to delete not found in database';
			}
			this.setState({ suggestion: data.status })
		})
	}

	render() {
		return (
			<div>
				<div className="container center">
					<TextField type="text" placeholder='Name' id="nameField" onChange={this.nameListener} />
					<TextField type="number" placeholder='ID' id="idField" onChange={this.idListener} />
					<TextField type="number" placeholder='Points' id="pointsField" onChange={this.pointsListener} />
					<h2>Name: {this.name} </h2>
					<h2>ID: {this.id} </h2>
					<h2>Points: {this.points} </h2>
					<h2>Response: {this.response} </h2>
					<Button color='primary' variant='contained' onClick={this.fetchData}>Get User</Button>
					<Button color='primary' variant='contained' onClick={this.postData}>Create User</Button>
					<Button color='primary' variant='contained' onClick={this.deleteData}>Delete User</Button>
				</div>
			</div>
		)
	}
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Home />
);