from mainapp import create_app, db  # Import the create_app function
from mainapp.models import Construction_manager

# Create the app instance
app = create_app()

# Use app context to access db
with app.app_context():
    # Create the admin user
    new_user = Construction_manager(username="Admin", password="123Abc")
    db.session.add(new_user)
    db.session.commit()

    # Check if the user was added successfully
    print(Construction_manager.query.all())  # This should print the user added.
