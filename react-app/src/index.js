import React from 'react';
import { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import ReactDOM from 'react-dom/client';

class ShoppingList extends React.Component {
	render() {
		return (
			<div className="shopping-list">
				<h1>Shopping list for {this.props.name}</h1>
				<ul>
					<li>{this.props.item1}</li>
					<li>{this.props.item2}</li>
					<li>{this.props.item3}</li>
				</ul>
			</div>
		);
	}
}

let name = '';
let id = 0;
let points = 0;
let response = '';

const nameListener = (event) => {
	name = event.target.value;
}
const idListener = (event) => {
	id = event.target.value;
}
const pointsListener = (event) => {
	points = event.target.value;
}

export class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = { suggestion: "" }
	}

	componentDidMount() {
		// For initial data
		// this.fetchData();
	}

	fetchData = () => {
		fetch(`http://localhost:5000/search?user=${name}`, {
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
					response = '200 response';
				}
				else if (data.status == 404) {
					response = 'User not found';
				}
				name = data.name
				id = data.id
				points = data.points
				this.setState({ suggestion: data.suggestion })
			})
			.catch((error) => {
				console.log(error, "catch the hoop")
			})
	}

	postData = () => {
		console.log(`name: ${name}, id: ${id}, points: ${points}`)
		fetch("http://localhost:5000/create", {
			method: "POST",
			dataType: "JSON",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ 'person_id': id, 'name': name, 'points': points })
		}).then((resp) => {
			response = resp.status;
			return resp.json();
		}).then((data) => {
			if (data.status === 200) {
				response = 'User created successfully';
			}
			this.setState({ suggestion: data.status });
		})
			.catch((error) => {
				console.log(error, "something went wrong creating a person");
			})
	}

	deleteData = () => {
		fetch("http://localhost:5000/delete", {
			method: "DELETE",
			dataType: "JSON",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ 'name': name })
		}).then((resp) => {
			return resp.json();
		}).then((data) => {

			if (data.status === 200) {
				response = 'Deleted user successfully';
			}
			else if (data.status === 404) {
				response = 'User to delete not found in database';
			}
			this.setState({ suggestion: data.status })
		})
	}

	render() {
		return (
			<div>
				<ItemLister suggestion={this.state.suggestion} />
				<div className="container center">
					<TextField type="text" placeholder='Name' id="nameField" onChange={nameListener} />
					<TextField type="number" placeholder='ID' id="idField" onChange={idListener} />
					<TextField type="number" placeholder='Points' id="pointsField" onChange={pointsListener} />
					<h2>Name: {name} </h2>
					<h2>ID: {id} </h2>
					<h2>Points: {points} </h2>
					<h2>Response: {response} </h2>
					<Button color='primary' variant='contained' onClick={this.fetchData}>Get User</Button>
					<Button color='primary' variant='contained' onClick={this.postData}>Create User</Button>
					<Button color='primary' variant='contained' onClick={this.deleteData}>Delete User</Button>
				</div>
			</div>
		)
	}
}

export class ItemLister extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<h2>
				{this.props.suggestion}
			</h2>
		)
	}
}

class InputField extends React.Component {
	render() {
		return (
			<input />
		)
	}
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Home />
);