import React from 'react';
import { useState } from 'react';
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
		this.fetchData();
	}

	fetchData = () => {
		fetch("http://localhost:5000/", {
			method: "GET",
			dataType: "JSON",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			}
		})
			.then((resp) => {
				return resp.json()
			})
			.then((data) => {
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
			return resp.json();
		}).catch((error) => {
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
		})
	}

	render() {
		return (
			<div>
				<ItemLister suggestion={this.state.suggestion} />
				<div className="container center">
					<input type="text" id="nameField" onChange={nameListener} />
					<input type="number" id="idField" onChange={idListener} />
					<input type="number" id="pointsField" onChange={pointsListener} />
					<h2>Name: {name} </h2>
					<h2>ID: {id} </h2>
					<h2>Points: {points} </h2>
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