from flask import Blueprint, request, jsonify
from mainapp import db
from mainapp.models import User
from flask_login import login_required,login_user, logout_user
from sqlalchemy import or_
from werkzeug.security import generate_password_hash


# Define Blueprint for site contractor management
site_contractor = Blueprint('site_contractor', __name__)

# View all site contractors
@site_contractor.route('/site_contractor/get_contractors', methods=['GET'])

def get_contractors():
    """
    Retrieve and return a list of all site contractors.
    """
    allowed_roles = ["Site Contractor", "Architecture", "Engineer"]

    contractors = User.query.filter(User.role.in_(allowed_roles)).all()
    contractor_list = [
        {
            "id": c.id,
            "name": c.name,
            "username": c.username,
           "password": "***" if c.password.startswith("scrypt:") else c.password,
            "email": c.email,
            "phone": c.phone,
            "address": c.address,
            "salary": str(c.salary),
            "role":c.role
            
        } 
        for c in contractors
    ]
    return jsonify({"contractors": contractor_list}), 200


# Create a new site contractor
@site_contractor.route('/site_contractor/create_contractor', methods=['POST'])

def create_contractor():
    """
    Create a new site contractor with full details.
    """
    data = request.get_json()

    # Validate required fields
    required_fields = ['name', 'username', 'email', 'password', 'phone', 'address', 'salary', 'role']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    try:
        # Create new site contractor
        new_contractor = User(
           
            name=data['name'],
            username=data['username'],
            email=data['email'],
            password=data['password'],  # Storing plaintext password as requested
            phone=data['phone'],
            address=data['address'],
            salary=data['salary'],
            role=data['role']
        )

        # Save to the database
        db.session.add(new_contractor)
        db.session.commit()

        return jsonify({
            "message": "Site contractor created successfully",
           
        }), 201
    
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500





@site_contractor.route('/site_contractor/update_contractor/<string:contractor_id>', methods=['PUT'])
def update_contractor(contractor_id):
    """
    Update an existing site contractor's details with duplicate validation.
    """
    data = request.get_json()
    
    # Find the contractor by ID
    contractor = User.query.get(contractor_id)
    if not contractor:
        return jsonify({"error": "Site contractor not found"}), 404

    # Extract new values from request
    new_username = data.get('username', contractor.username)
    new_email = data.get('email', contractor.email)

    # Check if username or email is already used by another contractor
    existing_user = User.query.filter(
        ((User.username == new_username) | (User.email == new_email)),
        User.id != contractor_id  # Exclude the current contractor
    ).first()

    if existing_user:
        return jsonify({"error": "Username or Email already exists"}), 400

    try:
        # Update fields if provided in requeste
       
        contractor.name = data.get('name', contractor.name)
        contractor.username = new_username
        contractor.email = new_email
        contractor.password = data.get('password', contractor.password)
        contractor.phone = data.get('phone', contractor.phone)
        contractor.salary = data.get('salary', contractor.salary)
        contractor.address = data.get('address', contractor.address)
        contractor.role = data.get('role', contractor.role)

        # Save changes to the database
        db.session.commit()

        return jsonify({"message": "Site contractor updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    



# Delete a site contractor
@site_contractor.route('/site_contractor/delete_contractor/<string:contractor_id>', methods=['DELETE'])

def delete_contractor(contractor_id):
    """
    Delete a site contractor by ID.
    """
    contractor = User.query.get(contractor_id)
    if not contractor:
        return jsonify({"error": "Contractor not found"}), 404

    db.session.delete(contractor)
    db.session.commit()
    return jsonify({"message": "Site contractor deleted successfully"}), 200


@site_contractor.route('/site_contractor/login', methods=['POST'])
def login():
    data = request.get_json()

    # Extracting data from request
    username = data.get('username') 
    email = data.get('email')
    password = data.get('password')

    # Check if a user with the provided username OR email exists
    contractor = User.query.filter(or_(User.username == username, User.email == email)).first()

    # If no user is found
    if not contractor:
        return jsonify({'message': 'Username or email not found'}), 404

    # Verify the password (plaintext comparison)
    if contractor.password != password:
        return jsonify({'message': 'Incorrect password'}), 401

    # Log in the user (if using Flask-Login)
    login_user(contractor)

    # Return success response
    return jsonify({
        'message': 'Logged in successfully',
        'username': contractor.username,
        'email': contractor.email
        }), 200








@site_contractor.route('/site/update_profile/<string:contractor_id>', methods=['PUT'])
def update_profile(contractor_id):
    """
    Update an existing site contractor's details with duplicate validation.
    """
    data = request.get_json()
    
    # Find the contractor by ID
    contractor = User.query.get(contractor_id)
    if not contractor:
        return jsonify({"error": "Site contractor not found"}), 404

    # Extract new values from request
    new_username = data.get('username', contractor.username)
    new_email = data.get('email', contractor.email)

    # Check if username or email is already used by another contractor
    


    try:
        # Update fields if provided in requeste
       
       
        contractor.username = new_username
        contractor.email = new_email

        if 'password' in data and data['password']:

         contractor.password = generate_password_hash(data['password'])

         contractor.phone = data.get('phone', contractor.phone)
         contractor.address = data.get('address', contractor.address)
        

        # Save changes to the database
        db.session.commit()

        return jsonify({"message": "Site contractor updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    

# Flask route for site contractors
@site_contractor.route('/site_contractors', methods=['GET'])
def get_site_contractors():
    allowed_roles = ["Site Contractor"]
    contractors = User.query.filter(User.role.in_(allowed_roles)).all()
    return jsonify([{"id": c.id, "name": c.name} for c in contractors])

# Flask route for clients


@site_contractor.route('/clients', methods=['GET'])
def get_clients():
    allowed_roles = ["Client"]
    clients = User.query.filter(User.role.in_(allowed_roles)).all()
    
    return jsonify([{"id": c.id, "username": c.username} for c in clients])
