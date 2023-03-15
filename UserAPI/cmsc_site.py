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
        return f"{self.name}, {self.person_id}:{self.points}"


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


@app.route('/search', methods=['GET'])
def search():
    name = request.args.get('user')

    person = db.session.query(UserModel).filter_by(name=name).first()
    print(f"person: {person}")
    if person is not None:
        return json.dumps({'success': True, 'status': 200, 'name': person.name, 'id': person.person_id, 'points': person.points})
    return json.dumps({'success': False, 'status': 404})


@app.route('/create', methods=['POST', 'PUT'])
def create():
    # data = request.get_data().decode()
    data = request.get_json()

    person_id = data.get('person_id')
    name = data.get('name')
    points = data.get('points')

    if person_id is None or name is None or points is None:
        return json.dumps({'success': False, 'status': 400})

    person = UserModel(person_id, name, points)

    db.session.add(person)
    db.session.commit()
    return json.dumps({'success': True, 'status': 200})


@app.route('/delete', methods=['DELETE'])
def delete():
    data = request.get_json()
    person_id = data.get('person_id')
    name = data.get('name')
    points = data.get('points')

    if name is None:
        return json.dumps({'success': False, 'status': 400})
    # person = UserModel(person_id, name, points)

    # query the database
    # person = db.session.query(UserModel).filter(UserModel.name == name).filter(
    # UserModel.person_id == person_id).filter(UserModel.points == points)
    person = db.session.query(UserModel).filter_by(name=name).first()
    print(f"found db object {person}")

    if person is not None:
        db.session.delete(person)
        db.session.commit()
        return json.dumps({'success': True, 'status': 200})
    return json.dumps({'success': False, 'status': 404})


if __name__ == "__main__":
    app.run()
