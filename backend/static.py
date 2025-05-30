from functools import wraps
from flask import Blueprint, flash, redirect, request, jsonify, url_for
from mainapp import db
from mainapp.models import Project, ProjectProgress, WorkRequest
from flask_login import login_required, current_user
from datetime import datetime
import traceback
# Define Blueprint for project management with a URL prefix
projects = Blueprint('projects', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
      if not current_user.is_authenticated or not current_user.admin:
       flash('You are not authorized to access this page.', 'danger')
       return redirect(url_for('admin.admin_login'))
    return f(*args, **kwarg) # type: ignore
    return decorated_function



# View all projects
# View all projects
@projects.route('/project/get_projects', methods=['GET'])
@login_required
@admin_required
def get_projects():
    """
    Retrieve and return a list of all projects.
    """
    try:
        projects = Project.query.all()
        project_list = [
            {
                "id": p.id,
                "p_name": p.p_name,  # Use p_name instead of name
                "description": p.description,
                "start_date": p.start_date.strftime("%Y-%m-%d") if p.start_date else None,
                "end_date": p.end_date.strftime("%Y-%m-%d") if p.end_date else None,
                "status": p.status,
                "budget": str(p.budget),  # Convert to string to avoid serialization issues
                "location": p.location,
                "site_contractor_id": p.site_contractor_id,
                "client_id": p.client_id
            }
            for p in projects
        ]

        return jsonify({"projects": project_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create a new project


@projects.route('/project/create_project', methods=['POST'])
@login_required
@admin_required
def create_project():
   
  #  Create a new project with full details.
    
    data = request.get_json()

    # Validate required fields   ## the code doesn't finished 
    required_fields = ['p_name', 'start_date', 'status', 'budget', 'location']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    try:
        # Convert start_date and end_date from string to datetime.date
        start_date = datetime.strptime(data['start_date'], "%Y-%m-%d").date()
        end_date = None
        if 'end_date' in data and data['end_date']:
            end_date = datetime.strptime(data['end_date'], "%Y-%m-%d").date()

        # Create new project
        new_project = Project(
            id=data.get('id'),  # If you want to generate an ID manually, otherwise remove it
            p_name=data['p_name'],
            description=data.get('description', ""),  # Optional field
            start_date=start_date,
            end_date=end_date,
            status=data['status'],
            budget=data['budget'],
            location=data['location'],
            site_contractor_id=data.get('site_contractor_id'),  # Optional field
            client_id=data.get('client_id')  # Optional field
        )

        # Save to the database
        db.session.add(new_project)
        db.session.commit()

        return jsonify({
            "message": "Project created successfully",
            "project": {
                "id": new_project.id,
                "p_name": new_project.p_name,
                "status": new_project.status,
                "budget": str(new_project.budget),
                "location": new_project.location
            }
        }), 201

    except ValueError as e:
        return jsonify({"error": f"Invalid date format. Use YYYY-MM-DD. Error: {str(e)}"}), 400

# Update a project
@projects.route('/project/update_project/<string:project_id>', methods=['PUT'])

def update_project(project_id):
    """
    Update an existing project by ID.
    """
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    data = request.get_json()
    
    # Update project fields if provided
    if 'p_name' in data:
            project.p_name = data['p_name']
    if 'description' in data:
            project.description = data.get('description', "")
    if 'start_date' in data:
            project.start_date = datetime.strptime(data['start_date'], "%Y-%m-%d").date()
    if 'end_date' in data:
            project.end_date = datetime.strptime(data['end_date'], "%Y-%m-%d").date() if data['end_date'] else None
    if 'status' in data:
            project.status = data['status']
    if 'budget' in data:
            project.budget = data['budget']
    if 'location' in data:
            project.location = data['location']
    if 'site_contractor_id' in data:
            project.site_contractor_id = data.get('site_contractor_id')
    if 'client_id' in data:
            project.client_id = data.get('client_id')

    # Save updates to the database
    db.session.commit()

    return jsonify({"message": "Project updated successfully"}), 200


