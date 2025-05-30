from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from mainapp.models import db, ProjectProgress, Project
import os
import time
from datetime import datetime
from werkzeug.utils import secure_filename
from sqlalchemy.orm.attributes import flag_modified
from flask import current_app



progress_bp = Blueprint('progress', __name__)

UPLOAD_FOLDER = '../frontend/public/assets/project_progress_images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp','jfif'}

# Ensure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@progress_bp.route('/api/progress', methods=['POST'])
def submit_progress():
    try:
        # Get form data
        description = request.form.get('description', '').strip()
        status = request.form.get('status', '').strip()
        phase1 = request.form.get('phase1') == 'true'
        phase2 = request.form.get('phase2') == 'true'
        phase3 = request.form.get('phase3') == 'true'
        p_id = int(request.form.get('p_id'))
        site_cont_id = int(request.form.get('site_cont_id'))
        updated_at_str = request.form.get('updated_at')

        if not all([description, status, updated_at_str]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Save images and collect URLs
        image_urls = []
        if 'images' in request.files:
            for image in request.files.getlist('images'):
                if image and image.filename and allowed_file(image.filename):
                    filename = secure_filename(image.filename)
                    unique_filename = f"{int(time.time())}_{filename}"
                    save_path = os.path.join(UPLOAD_FOLDER, unique_filename)
                    image.save(save_path)

                    # React-relative path
                    image_url = f"assets/project_progress_images/{unique_filename}"
                    image_urls.append(image_url)

        # Create progress record
        new_progress = ProjectProgress(
            description=description,
            status=status,
            phase1=phase1,
            phase2=phase2,
            phase3=phase3,
            p_id=p_id,
            site_cont_id=site_cont_id,
            updated_at=datetime.strptime(updated_at_str, "%Y-%m-%d"),
            image_urls=image_urls  # Store list directly
        )

        db.session.add(new_progress)
        db.session.commit()

        return jsonify({'message': 'Progress submitted successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Submission failed', 'details': str(e)}), 500



@progress_bp.route('/api/get_progress/<int:site_cont_id>', methods=['GET'])
def get_progress(site_cont_id):
    try:
        progress_list = ProjectProgress.query.filter_by(site_cont_id=site_cont_id).all()

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











@progress_bp.route('/api/update_progress/<int:progress_id>', methods=['PUT', 'OPTIONS'])
def update_progress(progress_id):
    try:
        progress = ProjectProgress.query.get(progress_id)
        if not progress:
            return jsonify({'error': 'Progress not found'}), 404

        # Get updated fields from form data
        progress.description = request.form.get('description', progress.description)
        progress.status = request.form.get('status', progress.status)
        progress.phase1 = request.form.get('phase1') == 'true'
        progress.phase2 = request.form.get('phase2') == 'true'
        progress.phase3 = request.form.get('phase3') == 'true'
        progress.p_id = int(request.form.get('p_id', progress.p_id))
        progress.site_cont_id = int(request.form.get('site_cont_id', progress.site_cont_id))

        updated_at_str = request.form.get('updated_at')
        if updated_at_str:
            progress.updated_at = datetime.strptime(updated_at_str, "%Y-%m-%d")

        # Handle new image uploads (optional: clear old ones)
        if 'images' in request.files:
            # Optionally remove old images from disk
            for url in progress.image_urls:
                file_path = os.path.join('../frontend/public', url)
                if os.path.exists(file_path):
                    os.remove(file_path)

            new_image_urls = []
            for image in request.files.getlist('images'):
                if image and image.filename and allowed_file(image.filename):
                    filename = secure_filename(image.filename)
                    unique_filename = f"{int(time.time())}_{filename}"
                    save_path = os.path.join(UPLOAD_FOLDER, unique_filename)
                    image.save(save_path)

                    image_url = f"assets/project_progress_images/{unique_filename}"
                    new_image_urls.append(image_url)

            progress.image_urls = new_image_urls

        db.session.commit()
        return jsonify({'message': 'Progress updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update progress', 'details': str(e)}), 500






@progress_bp.route('/api/delete_progress/<int:progress_id>', methods=['DELETE'])
def delete_progress(progress_id):
    try:
        progress = ProjectProgress.query.get(progress_id)
        if not progress:
            return jsonify({'error': 'Progress not found'}), 404

        # Optionally delete associated images from the filesystem
        if progress.image_urls:
            for url in progress.image_urls:
                file_path = os.path.join('../frontend/public', url)
                if os.path.exists(file_path):
                    os.remove(file_path)

        db.session.delete(progress)
        db.session.commit()
        return jsonify({'message': 'Progress deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete progress', 'details': str(e)}), 500






@progress_bp.route('/api/upload_progress_image/<int:progress_id>', methods=['POST'])
def upload_progress_image(progress_id):
    try:
        progress = ProjectProgress.query.get(progress_id)
        if not progress:
            return jsonify({'error': 'Progress not found'}), 404

        files = request.files.getlist('images')
        if not files:
            return jsonify({'error': 'No files uploaded'}), 400

        saved_urls = []

        # Get absolute path to frontend/public/assets/project_progress_images
        frontend_folder = os.path.abspath(os.path.join(
            current_app.root_path, '..', '..', 'frontend', 'public', 'assets', 'project_progress_images'
        ))
        os.makedirs(frontend_folder, exist_ok=True)

        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                unique_filename = f"{int(time.time())}_{filename}"
                save_path = os.path.join(frontend_folder, unique_filename)
                file.save(save_path)

                # Relative path from public folder for React access
                file_url = f"assets/project_progress_images/{unique_filename}"
                saved_urls.append(file_url)

        # Update the progress record
        progress.image_urls = (progress.image_urls or []) + saved_urls
        flag_modified(progress, 'image_urls')  # Needed if image_urls is a JSON/array field
        db.session.commit()

        return jsonify({
            'message': 'Images uploaded successfully',
            'new_images': saved_urls,
            'all_images': progress.image_urls
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Upload failed', 'details': str(e)}), 500






@progress_bp.route('/api/get_uploaded_images/<int:progress_id>', methods=['GET'])
def get_uploaded_images(progress_id):
    try:
        progress = ProjectProgress.query.get(progress_id)
        if not progress:
            return jsonify({'error': 'Progress not found'}), 404

        # Return the list of image URLs (can be empty)
        return jsonify({
            'progress_id': progress_id,
            'images': progress.image_urls or []
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to retrieve images', 'details': str(e)}), 500



















@progress_bp.route('/api/delete_progress_image', methods=['DELETE'])
def delete_progress_image():
    try:
        data = request.get_json()
        progress_id = data.get('progress_id')
        image_url = data.get('image_url')

        if not all([progress_id, image_url]):
            return jsonify({'error': 'progress_id and image_url required'}), 400

        progress = ProjectProgress.query.get(progress_id)
        if not progress:
            return jsonify({'error': 'Progress entry not found'}), 404

        # Match based on filename only
        image_filename = os.path.basename(image_url)
        current_images = progress.image_urls or []

        if not any(os.path.basename(url) == image_filename for url in current_images):
            return jsonify({'error': 'Image URL not found in progress'}), 404

        # Remove image file from disk
        file_path = os.path.join(UPLOAD_FOLDER, image_filename)
        if os.path.exists(file_path):
            os.remove(file_path)

        # Remove the matching image URL from DB
        updated_images = [url for url in current_images if os.path.basename(url) != image_filename]
        progress.image_urls = updated_images
        db.session.commit()

        return jsonify({'message': 'Image deleted successfully', 'remaining_images': updated_images}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Delete failed', 'details': str(e)}), 500






