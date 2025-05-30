#backend\mainapp\controllers\auth\route.py
from flask import Blueprint, request, jsonify
from mainapp import db, bcrypt
from mainapp.models import Construction_manager, User
from flask_login import login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text, inspect
from werkzeug.security import check_password_hash



auth = Blueprint('auth', __name__)



@auth.route('/auth/login', methods=['POST'])

def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # Get user role from request

    # Determine which table to check based on the role
    if role == "admin":
        user = Construction_manager.query.filter_by(username=username).first()
    elif role == "site_contractor":
        user = User.query.filter_by(username=username, role='Site Contractor' ).first()
    elif role == "client":
        user = User.query.filter_by(username=username, role='Client').first() 
    else:
        return jsonify({'message': 'Invalid role'}), 400

    if not user:
        return jsonify({'message': 'Username not found'}), 404
    stored_password = user.password

    if stored_password.startswith("pbkdf2:") or stored_password.startswith("scrypt:"):
        if not check_password_hash(stored_password, password):
            return jsonify({'message': 'Incorrect password'}), 401
    else:
        if stored_password != password:
            return jsonify({'message': 'Incorrect password'}), 401

    return jsonify({
    'message': 'Login successful',
    'user': {
        'id': user.id,
        'username': user.username,
        'password':user.password
    }
}), 200


@auth.route('/auth/user/<int:id>', methods=['GET'])
def get_user_by_id(id):
    user = User.query.get(id) or Construction_manager.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'user': {
            'id': user.id,
            'username': user.username,
            'email':user.email,
            'phone':user.phone,
            'address':user.address,
            "password": "***" if user.password.startswith("scrypt:") else user.password,  # Optional: Remove if you're concerned about showing passwords
        }
    })






# @auth.route('/auth/forgot-password', methods=['POST'])
# def forgot_password():
#     data = request.get_json()
#     email = data.get('email')
#     new_password = data.get('new_password')

#     user = User.query.filter_by(email=email).first()
#     if user:
#         user.password = new_password  # hash this if needed
#         db.session.commit()
#         return jsonify({"message": "Password reset successful"}), 200
#     else:
#         return jsonify({"message": "Email not found"}), 404


