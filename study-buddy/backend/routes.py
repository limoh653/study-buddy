
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, db, StudyGroup
from utils.auth import hash_password, verify_password
from flask_login import login_required, current_user

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = hash_password(data['password'])
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="User registered successfully"), 201

@api_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and verify_password(data['password'], user.password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify(message="Invalid credentials"), 401

@api_blueprint.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user:
        new_password = hash_password(data['new_password'])
        user.password = new_password
        db.session.commit()
        return jsonify(message="Password reset successfully"), 200
    return jsonify(message="User not found"), 404

@api_blueprint.route('/study-group', methods=['GET'])
def get_study_groups():
    study_groups = StudyGroup.query.all()
    if not study_groups:
        return jsonify({'message': 'No study groups found.'}), 404
    return jsonify({'study_groups': [group.to_dict() for group in study_groups]}), 200




# The /profile endpoint that returns the current user's profile data
@api_blueprint.route('/profile', methods=['GET'])
@jwt_required()  # Require a valid JWT token to access this route
def get_profile():
    # Get the current user's identity from the JWT token
    user_id = get_jwt_identity()

    # Query the user from the database
    user = User.query.get(user_id)

    # If the user is found, return their profile information
    if user:
        return jsonify({
            'username': user.username,
            'email': user.email,
            # Add any other fields you want to include
        }), 200

    # If no user is found (unlikely if JWT is valid), return a 404
    return jsonify({'message': 'User not found'}), 404