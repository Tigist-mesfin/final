from flask import Blueprint, request, jsonify
from mainapp import db
from mainapp.models import User
from flask_login import login_required,login_user
from sqlalchemy import or_

# Define Blueprint for site client management
client = Blueprint('client', __name__)

# View all site client
@client.route('/client/get_client', methods=['GET'])

def get_client():
    """
    Retrieve and return a list of all site client.
    """
    allowed_roles = ["Client"]
    client = User.query.filter(User.role.in_(allowed_roles)).all()
    client_list = [
        {
            "id":c.id,
            "username": c.username,
            "password": "***" if c.password.startswith("scrypt:") else c.password,
            "email": c.email,
            "phone": c.phone,
            "address": c.address,
          
           
          
        } 
        for c in client
    ]
    return jsonify({"client": client_list}), 200


# Create a new site client
@client.route('/client/create_client', methods=['POST'])

def create_client():
    """
    Create a new site client with full details.
    """
    data = request.get_json()

    # Validate required fields
    required_fields = [  'username', 'email', 'password', 'phone', 'address','role']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    try:
        # Create new site client
        new_client = User(
           
         
            username=data['username'],
            email=data['email'],
            password=data['password'],  # Storing plaintext password as requested
            phone=data['phone'],
            address=data['address'],
            role=data['role']

           
         
        )

        # Save to the database
        db.session.add(new_client)
        db.session.commit()

        return jsonify({
            "message": "Site client created successfully",
            "client": {
            
                "username": new_client.username,
                "email": new_client.email,
                "phone": new_client.phone,
             
            }
        }), 201
    
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500



@client.route('/client/update_client/<string:client_id>', methods=['PUT'])
def update_client(client_id):
    """
    Update an existing site client's details.
    """
    data = request.get_json()

    # Find the client by ID
    client = User.query.get(client_id)
    if not client:
        return jsonify({"error": "Site client not found"}), 404


    new_username = data.get('username', client.username)
    new_email = data.get('email', client.email)
    # NEW CODE START: Check for existing username or email
    existing_user = User.query.filter(
        ((User.username == new_username) | (User.email == new_email)),
        User.id != client_id  # Exclude the current contractor
    ).first()

    if existing_user and existing_user.id != client.id:
        return jsonify({"error": "Username or email already exists"}), 400
    # NEW CODE END

    try:
        # Update fields if provided in request
        client.username = data.get('username', client.username)
        client.email = data.get('email', client.email)
        client.password = data.get('password', client.password)
        client.phone = data.get('phone', client.phone)
        client.address = data.get('address', client.address)

        # Save changes to the database
        db.session.commit()

        return jsonify({
            "message": "Site client updated successfully",
            "client": {
                "id": client.id,
                "username": client.username,
                "email": client.email,
                "phone": client.phone
            }
        }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Delete a site client
@client.route('/client/delete_client/<string:client_id>', methods=['DELETE'])

def delete_client(client_id):
    """
    Delete a site client by ID.
    """
    client = User.query.get(client_id)
    if not client:
        return jsonify({"error": "client not found"}), 404

    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Site client deleted successfully"}), 200


@client.route('/client/login', methods=['POST'])
def login():
    data = request.get_json()

    # Extracting data from request
    username = data.get('username') 
    email = data.get('email')
    password = data.get('password')



    # Check if a user with the provided username OR email exists
    client = User.query.filter(or_(User.username == username, User.email == email)).first()

    # If no user is found
    if not client:
        return jsonify({'message': 'Username or email not found'}), 404

    # Verify the password (plaintext comparison)
    if client.password != password:
        return jsonify({'message': 'Incorrect password'}), 401

    # Log in the user (if using Flask-Login)
    login_user(client)

    # Return success response
    return jsonify({
        'message': 'Logged in successfully',
        'username': client.username,
        'email': client.email
        }), 200




