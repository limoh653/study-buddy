from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, db, StudyGroup, GroupMembership
from utils.auth import hash_password, verify_password
from flask_cors import CORS  # Ensure you have this imported

api_blueprint = Blueprint('api', __name__)
CORS(api_blueprint, resources={r"/*": {"origins": "https://study-buddy-1.onrender.com"}})  # Set up CORS

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
    
    # Retrieve the study groups and their members from the database using the GroupMembership relationships
    return jsonify({
        'study_groups': [
            {
                'id': group.id,
                'name': group.name,
                'members': [{'id': member.user.id, 'username': member.user.username} for member in group.members]
            }
            for group in study_groups
        ]
    }), 200


@api_blueprint.route('/study-group/join', methods=['POST'])
@jwt_required()
def join_study_group():
    data = request.get_json()
    group_id = data.get('groupId')

    if not group_id:
        return jsonify(message="Group ID is required"), 400

    study_group = StudyGroup.query.get(group_id)
    if not study_group:
        return jsonify(message="Study group not found"), 404

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Check if the user is already a member of the group
    if any(member.user_id == user.id for member in study_group.members):
        return jsonify(message="You are already a member of this group"), 400

    # Add the user to the study group
    new_membership = GroupMembership(user_id=user.id, group_id=group_id)
    db.session.add(new_membership)
    db.session.commit()
    
    return jsonify(
        message="Joined group successfully", 
        members=[{'id': member.user.id, 'username': member.user.username} for member in study_group.members]
    ), 200

@api_blueprint.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'username': user.username,
            'email': user.email,
        }), 200
    return jsonify({'message': 'User not found'}), 404
