from flask import Blueprint, request, jsonify
from mainapp import db
from mainapp.models import Employee
from flask_login import login_required,login_user, logout_user
from sqlalchemy import or_

# Define Blueprint for site contractor management
employee = Blueprint('employee', __name__)

# View all site contractors
@employee.route('/employee/get_employee/<int:site_cont_id>', methods=['GET'])

def get_employee(site_cont_id):
    """
    Retrieve and return a list of all site contractors.
    """
    # allowed_roles = ["Site Contractor", "Architecture", "Engineer"]filter(User.role.in_(allowed_roles))

    employees = Employee.query.filter_by(site_cont_id=site_cont_id).all()
    employee_list = [
        {
            "id": c.id,
            "full_name": c.full_name,
            "email": c.email,
            "phone": c.phone,
            "address": c.address,
            "salary": str(c.salary),
            "p_id":c.p_id,
            "site_cont_id":c.site_cont_id,
            "role":c.role
            
        } 
        for c in employees
    ]
    return jsonify({"employees": employee_list}), 200


# Create a new site employee
@employee.route('/employee/create_employee', methods=['POST'])

def create_employee():
    """
    Create a new site employee with full details.
    """
    data = request.get_json()

    # Validate required fields
    required_fields = ['full_name',  'email', 'phone', 'address', 'salary', 'p_id','site_cont_id','role']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    try:
        # Create new site employee
        new_employee = Employee(
           
            full_name=data['full_name'],
            email=data['email'],
            phone=data['phone'],
            address=data['address'],
            salary=data['salary'],
            p_id=data['p_id'],
            site_cont_id=data['site_cont_id'],
            role=data['role']
        )

        # Save to the database
        db.session.add(new_employee)
        db.session.commit()

        return jsonify({
            "message": "employee created successfully",
           
        }), 201
    
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500





@employee.route('/employee/update_employee/<string:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    """
    Update an existing site employee's details with duplicate validation.
    """
    data = request.get_json()
    
    # Find the employee by ID
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"error": "employee not found"}), 404

    # Extract new values from request
    
    new_email = data.get('email', employee.email)

    # Check if username or email is already used by another contractor
    existing_user = Employee.query.filter(
    (Employee.email == new_email) & (Employee.id != employee_id)
).first()


    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    try:
        # Update fields if provided in requeste
       
        employee.full_name = data.get('full_name', employee.full_name)
        employee.email = new_email
        employee.phone = data.get('phone', employee.phone)
        employee.salary = data.get('salary', employee.salary)
        employee.address = data.get('address', employee.address)
        employee.p_id = data.get('p_id',employee.p_id)
        employee.site_cont_id = data.get('site_cont_id', employee.site_cont_id)
        employee.role = data.get('role', employee.role)

        # Save changes to the database
        db.session.commit()

        return jsonify({"message": "employee updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    



# Delete a site employee
@employee.route('/employee/delete_employee/<string:employee_id>', methods=['DELETE'])

def delete_employee(employee_id):
    """
    Delete a site employee by ID.
    """
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"error": "employee not found"}), 404

    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "employee deleted successfully"}), 200

