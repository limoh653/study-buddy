from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import db, User, StudyGroup, Membership, Message
from werkzeug.security import generate_password_hash, check_password_hash

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    hashed_password = generate_password_hash(password)

    new_user = User(username=username, password_hash=hashed_password, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(message='User created successfully'), 201

@api_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

    return jsonify(message='Invalid username or password'), 401

@api_bp.route('/api/groups', methods=['POST'])
@jwt_required()
def create_group():
    current_user_id = get_jwt_identity()
    data = request.json
    new_group = StudyGroup(name=data['name'], subject=data['subject'], created_by=current_user_id)
    db.session.add(new_group)
    db.session.commit()
    return jsonify(message='Group created successfully'), 201

@api_bp.route('/api/groups', methods=['GET'])
@jwt_required()
def get_groups():
    groups = StudyGroup.query.all()
    return jsonify([{'id': group.id, 'name': group.name, 'subject': group.subject} for group in groups]), 200

@api_bp.route('/api/groups/<int:group_id>/messages', methods=['POST'])
@jwt_required()
def send_message(group_id):
    current_user_id = get_jwt_identity()
    data = request.json
    new_message = Message(group_id=group_id, user_id=current_user_id, content=data['content'])
    db.session.add(new_message)
    db.session.commit()
    return jsonify(message='Message sent'), 201

@api_bp.route('/api/groups/<int:group_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(group_id):
    messages = Message.query.filter_by(group_id=group_id).all()
    return jsonify([{'content': message.content, 'user_id': message.user_id} for message in messages]), 200
