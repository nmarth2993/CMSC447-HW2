from random import randint
from flask import Flask
from flask import request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()


class UserModel(db.Model):
    __tablename__ = "users"
    db_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    person_id = db.Column(db.Integer())
    points = db.Column(db.Integer())

    def __init__(self, person_id, name, points):
        self.person_id = person_id
        self.name = name
        self.points = points

    def __repr__(self) -> str:
        return f"{self.lastname}, {self.firstname}:{self.person_id}"


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


@app.before_first_request
def create_table():
    db.create_all()


@app.route('/')
def hello_world():

    a = randint(1, 100)
    return json.dumps({"suggestion": a})


@app.route('/create', methods=['POST', 'PUT'])
def create():
    # data = request.get_data().decode()
    data = request.get_json()

    person_id = data.get('person_id')
    name = data.get('name')
    points = data.get('points')

    person = UserModel(person_id, name, points)

    db.session.add(person)
    db.session.commit()
    return json.dumps({'success': True, 'status': 200})


@app.route('/delete', methods=['POST'])
def delete():
    data = request.get_json()
    person_id = data.get('person_id')
    name = data.get('name')
    points = data.get('points')
    person = UserModel(person_id, name, points)

    db.session.remove(person)
    db.session.commit()
    return json.dumps({'success': True, 'status': 200})


if __name__ == "__main__":
    app.run()
