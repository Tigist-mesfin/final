from flask import Blueprint, request, jsonify
from mainapp import db
from mainapp.models import Request, User
from flask_mail import Message
from mainapp import mail
import traceback  # Import traceback for better error logging
import random
from werkzeug.security import generate_password_hash

customer = Blueprint('customer', __name__)

@customer.route('/api/submit_request', methods=['POST'])
def submit_request():
    try:
        data = request.json
        new_request = Request(
            UserEmail=data['UserEmail'],
            Budget=float(data['Budget']),
            AdditionalDetails=data.get('AdditionalDetails', ''),
            Location=data['Location'],  # New field
            TypeOfBuilding=data['TypeOfBuilding'],  # New field
            Area=float(data['Area']),
            NumberOfFloors=int(data['NumberOfFloors']),
            NumberOfRooms=int(data['NumberOfRooms']),
            RoofType=data['RoofType'] 
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify({'message': 'Request submitted successfully!'}), 201
    except Exception as e:
        db.session.rollback() 
        print("Error:", str(e))  # Print the error to the console
        traceback.print_exc()  # Print detailed error trace
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close() 


@customer.route('/api/requests', methods=['GET'])
def get_all_requests():
    try:
        requests = Request.query.order_by(Request.RequestID.desc()).all()
        data = []
        for req in requests:
            data.append({
                'RequestID': req.RequestID,
                'UserEmail': req.UserEmail,
                'Budget': str(req.Budget),
                'AdditionalDetails': req.AdditionalDetails,
                'Location': req.Location,
                'TypeOfBuilding': req.TypeOfBuilding,
                'Area': str(req.Area),
                'NumberOfFloors': req.NumberOfFloors,
                'NumberOfRooms': req.NumberOfRooms,
                'RoofType': req.RoofType,
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












@customer.route('/api/requests/<int:request_id>/reply', methods=['POST'])
def reply_to_request(request_id):
    try:
        data = request.get_json()
        reply_message = data.get('reply')  # should be 'Accepted' or 'Rejected'

        req = Request.query.get(request_id)
        if not req:
            return jsonify({'error': 'Request not found'}), 404

        # Update the request status and admin reply
        req.Status = reply_message
        req.AdminReply = f'Your request has been {reply_message.lower()}.'
        db.session.commit()

        # Send email to the requester
        msg = Message(
            subject="Construction Request Update",
            sender="amboconstruction264@gmail.com",
            recipients=[req.UserEmail]
        )
        msg.body = f"Dear User,\n\nYour construction request has been {reply_message.lower()}.\n\nThank you!"
        mail.send(msg)

        return jsonify({'message': f'Reply sent and email delivered to {req.UserEmail}'}), 200
    except Exception as e:
        db.session.rollback() 
        print("Error:", str(e))
        traceback.print_exc()  # Print detailed error trace
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close() 













@customer.route('/api/requests/<int:request_id>/update', methods=['PATCH'])
def update_request(request_id):
    try:
        data = request.get_json()
        admin_reply = data.get('AdminReply')
        status = data.get('Status')

        req = Request.query.get(request_id)
        if not req:
            return jsonify({'error': 'Request not found'}), 404

        req.AdminReply = admin_reply
        req.Status = status
        db.session.commit()

        # ✅ Send email notification
        subject = f"Your Request has been {admin_reply}"
        body = f"""
        Hello,

        Your request for a construction project has been reviewed.

        Status: {status}
        Admin Reply: {admin_reply}

        

        Thank you,
        Ambo Construction Team
        """
        msg = Message(subject, recipients=[req.UserEmail])
        msg.body = body
        mail.send(msg)

        return jsonify({'message': 'Request updated and email sent successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close()





        



# Store codes temporarily
verification_codes = {}

@customer.route('/auth/send-code', methods=['POST'])
def send_verification_code():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Email not found"}), 404

    code = str(random.randint(1000, 9999))
    verification_codes[email] = code  # Save code temporarily

    # Send email
    msg = Message("Password Reset Code", sender="amboconstruction264@gmail.com", recipients=[email])
    msg.body = f"Your password reset code is: {code}"
    mail.send(msg)

    return jsonify({"message": "Code sent to email."}), 200



@customer.route('/auth/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if verification_codes.get(email) == code:
        return jsonify({"message": "Code verified"}), 200
    else:
        return jsonify({"message": "Invalid code"}), 400








@customer.route('/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    user = User.query.filter_by(email=email).first()
    if user:
        user.password = generate_password_hash(new_password)
        db.session.commit()
        verification_codes.pop(email, None)  # Clear used code
        return jsonify({"message": "Password reset successful"}), 200
    return jsonify({"message": "User not found"}), 404






        
# @customer.route('/test-email')
# def test_email():
#     try:
#         msg = Message(
#             subject='Test Email from Flask',
#             recipients=['eshetezerubabel@gmail.com'],  # use a real email here
#             body='This is a test email from Flask to verify email sending.'
#         )
#         mail.send(msg)
#         return jsonify({'message': 'Email sent successfully!'}), 200
#     except Exception as e:
#         print("Error sending email:", str(e))
   
# #    http://localhost:5000/test-email


