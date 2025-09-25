from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
from routes import api_blueprint
from extensions import db
import config

# Load environment variables from .env file
load_dotenv()

# Initialize the Flask application
app = Flask(__name__)

# Load configuration from config.py
app.config.from_object(config.Config)

# Initialize CORS for all routes and allow React frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Initialize the database and JWT manager
db.init_app(app)
jwt = JWTManager(app)

# Set up Flask-Migrate
migrate = Migrate(app, db)

# Register API blueprint with optional prefix (here no prefix)
app.register_blueprint(api_blueprint, url_prefix="")  # Keep empty so routes match /study-group etc.

# Optional: Print all registered routes to debug 404s
with app.app_context():
    for rule in app.url_map.iter_rules():
        print(f"Route: {rule} -> {rule.endpoint}")
    db.create_all()  # Ensure tables exist

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
