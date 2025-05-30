from flask import Blueprint, request, jsonify
from mainapp import db
from mainapp.models import Project, ProjectProgress, WorkRequest
from flask_login import login_required, current_user
from datetime import datetime
import traceback
# Define Blueprint for project management with a URL prefix
project = Blueprint('project', __name__)



# View all projects
# View all projects
@project.route('/project/get_projects', methods=['GET'])
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
                'TypeOfBuilding': p.TypeOfBuilding,
                'Area': str(p.Area),
                'NumberOfFloors': p.NumberOfFloors,
                'NumberOfRooms': p.NumberOfRooms,
                'RoofType': p.RoofType,
                "site_contractor_id": p.site_contractor_id,
                "client_id": p.client_id
            }
            for p in projects
        ]

        return jsonify({"projects": project_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create a new project


@project.route('/project/create_project', methods=['POST'])

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
            TypeOfBuilding=data['TypeOfBuilding'],  # New field
            Area=float(data['Area']),
            NumberOfFloors=int(data['NumberOfFloors']),
            NumberOfRooms=int(data['NumberOfRooms']),
            RoofType=data['RoofType'],
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
@project.route('/project/update_project/<string:project_id>', methods=['PUT'])

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



# Delete a project
@project.route('/project/delete_project/<string:project_id>', methods=['DELETE'])

def delete_project(project_id):
    """
    Delete a project by ID.
    """
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted successfully"}), 200




@project.route('/api/get_projects_by_site_contr/<int:site_contractor_id>', methods=['GET'])
def get_projects_by_site_contr(site_contractor_id):
    try:
        projects = Project.query.filter_by(site_contractor_id=site_contractor_id).all()

        result = []
        for p in projects:
            result.append({
                'id': p.id,
                'name': p.p_name,
                'description':p.description,
                'start_date': p.start_date.strftime("%Y-%m-%d"),
                'end_date': p.end_date.strftime("%Y-%m-%d"),
                'status': p.status,
                'budget': p.budget,
                'location': p.location,
                'site_contractor_id': p.site_contractor_id,
                'client_id': p.client_id
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch projects', 'details': str(e)}), 500




@project.route('/api/client/<int:client_id>/progress', methods=['GET'])
def get_client_project_progress(client_id):
    try:
        # Get all progress entries for projects that belong to this client
        progress_entries = (
            db.session.query(ProjectProgress)
            .join(Project, Project.id == ProjectProgress.p_id)
            .filter(Project.client_id == client_id)
            .all()
        )

        # Prepare response data
        progress_list = []
        for progress in progress_entries:
            progress_list.append({
                'id': progress.id,
                'description': progress.description,
                'status': progress.status,
                'phase1': progress.phase1,
                'phase2': progress.phase2,
                'phase3': progress.phase3,
                'project_id': progress.p_id,
                'site_contractor_id': progress.site_cont_id,
                'updated_at': progress.updated_at.strftime("%Y-%m-%d") if progress.updated_at else None,
                'image_urls': progress.image_urls
            })

        return jsonify(progress_list), 200

    except Exception as e:
        print(f"[ERROR] Failed to fetch project progress: {e}")
        return jsonify({'error': 'An error occurred while fetching progress data'}), 500


















@project.route('/api/get_progress', methods=['GET'])
def get_progress():
    try:
        progress_list = ProjectProgress.query.all()

        results = []
        for progress in progress_list:
            results.append({
                'id': progress.id,
                'description': progress.description,
                'status': progress.status,
                'phase1': progress.phase1,
                'phase2': progress.phase2,
                'phase3': progress.phase3,
                'p_id': progress.p_id,
                'site_cont_id': progress.site_cont_id,
                'updated_at': progress.updated_at.strftime("%Y-%m-%d"),
                'image_urls': progress.image_urls
            })

        return jsonify(results), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch progress data', 'details': str(e)}), 500






# work requiest// creating a work request


@project.route("/api/work-requests", methods=["POST"])
def submit_work_request():
    data = request.get_json()
    
    try:
        date_of_inspection = datetime.strptime(data['date_of_inspection'], "%Y-%m-%d").date()
        new_request = WorkRequest(
            id=data.get('id'),
            location=data["location"],
            description_of_works=data["description_of_works"],
            equipment_machinery=data.get("equipment_machinery", ""),
            date_of_inspection=date_of_inspection,
            site_cont_id=data.get('site_contractor_id'),
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({"message": "Work request submitted successfully"}), 201

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500





#  getting a workrequesting

@project.route('/api/work-requests', methods=['GET'])
def get_all_requests():
    try:
        requests = WorkRequest.query.order_by(WorkRequest.id.desc()).all()
        data = []
        for req in requests:
            data.append({
                'id': req.id,
                'description_of_works': req.description_of_works,
                'equipment_machinery': req.equipment_machinery,
                'location': req.location,
                'date_of_inspection': req.date_of_inspection,
                'site_cont_id':req.site_cont_id,
                'Status': req.Status,
                'AdminReply': req.AdminReply
            })
        return jsonify(data), 200
    except Exception as e:
        db.session.rollback() 
        print("Error:", str(e))
        traceback.print_exc()  # Print detailed error trace
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close() 





        




@project.route('/api/work-requests/<int:request_id>/update', methods=['PATCH'])
def update_request(request_id):
    try:
        data = request.get_json()
        admin_reply = data.get('AdminReply')
        status = data.get('Status')

        req = WorkRequest.query.get(request_id)
        if not req:
            return jsonify({'error': 'Request not found'}), 404

        req.AdminReply = admin_reply
        req.Status = status
        db.session.commit()

        return jsonify({'message': 'Request updated successfully'})
    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close()




























# @project.route('/project/progress/all', methods=['GET'])
# def get_all_progress_with_projects():
#     # Get all progress entries with their associated projects
#     progress_entries = db.session.query(
#         ProjectProgress,
#         Project
#     ).join(
#         Project,
#         ProjectProgress.p_id == Project.id
#     ).all()

#     result = []
#     for progress, project in progress_entries:
#         result.append({
#             "progress": {
#                 "id": progress.id,
#                 "description": progress.description,
#                 "status": progress.status,
#                 "phase1": progress.phase1,
#                 "phase2": progress.phase2,
#                 "phase3": progress.phase3,
#                 "updated_at": progress.updated_at.strftime("%Y-%m-%d") if progress.updated_at else None,
#                 "image_urls": progress.image_urls,
#             },
#             "project": {
#                 "id": project.id,
#                 "p_name": project.p_name,
#                 "description": project.description,
#             }
#         })

#     return jsonify(result)