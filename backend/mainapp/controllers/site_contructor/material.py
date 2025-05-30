from flask import Blueprint, request, jsonify
from mainapp import db
from mainapp.models import Material
from flask_login import login_required,login_user, logout_user
from sqlalchemy import or_

# Define Blueprint for site contractor management
material = Blueprint('material', __name__)

# View all site contractors
@material.route('/material/get_material/<int:site_cont_id>', methods=['GET'])

def get_material(site_cont_id):
    """
    Retrieve and return a list of all site contractors.
    """
    # allowed_roles = ["Site Contractor", "Architecture", "Engineer"]filter(User.role.in_(allowed_roles))
    material = Material.query.filter_by(site_cont_id=site_cont_id).all()
    material_list = [
        {
            "id": c.id,
           "name": c.name,
            "quantity": c.quantity,
            "unit": c.unit,
            "cost": c.cost,
            "p_id":c.p_id,
            "site_cont_id":c.site_cont_id,
         
        } 
        for c in material
    ]
    return jsonify({"materials": material_list}), 200


# Create a new site material
@material.route('/material/create_material', methods=['POST'])

def create_material():
    """
    Create a new site material with full details.
    """
    data = request.get_json()

    # Validate required fields
    required_fields = ['name',  'quantity', 'unit', 'cost',  'p_id', 'site_cont_id']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    try:
        # Create new site material
        new_material = Material(
           
            name=data['name'],
            quantity=data['quantity'],
            unit=data['unit'],
            cost=data['cost'],
            p_id=data['p_id'],
            site_cont_id=data['site_cont_id'],
         
        )

        # Save to the database
        db.session.add(new_material)
        db.session.commit()

        return jsonify({
            "message": "material created successfully",
           
        }), 201
    
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500





@material.route('/material/update_material/<string:material_id>', methods=['PUT'])
def update_material(material_id):
    """
    Update an existing site material's details with duplicate validation.
    """
    data = request.get_json()
    
    # Find the material by ID
    material = Material.query.get(material_id)
    if not material:
        return jsonify({"error": "material not found"}), 404

    try:
        # Update fields if provided in requeste
       
        material.name = data.get('name', material.name)
        material.quantity = data.get('quantity', material.quantity)
        material.unit = data.get('unit', material.unit)
        material.cost = data.get('cost', material.cost)
        material.p_id = data.get('p_id',material.p_id)
        material.site_cont_id = data.get('site_cont_id', material.site_cont_id)
        
        # Save changes to the database
        db.session.commit()

        return jsonify({"message": "material updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    



# Delete a site material
@material.route('/material/delete_material/<string:material_id>', methods=['DELETE'])

def delete_material(material_id):
    """
    Delete a site material by ID.
    """
    material = Material.query.get(material_id)
    if not material:
        return jsonify({"error": "material not found"}), 404

    db.session.delete(material)
    db.session.commit()
    return jsonify({"message": "material deleted successfully"}), 200




