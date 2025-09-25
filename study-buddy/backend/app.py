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

# ------------------ UPDATED ------------------
# Initialize CORS for both local dev and production frontend

CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:3000", "https://study-buddy001.onrender.com"]}},
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # <-- allow all methods
)
# Initialize the database and JWT manager
db.init_app(app)
jwt = JWTManager(app)

# Set up Flask-Migrate
migrate = Migrate(app, db)

# ------------------ UPDATED ------------------
# Register API blueprint (no prefix so routes match exactly)
app.register_blueprint(api_blueprint, url_prefix="")  
# ---------------------------------------------

# ------------------ UPDATED ------------------
# Optional: print all registered routes to debug 404s
with app.app_context():
    for rule in app.url_map.iter_rules():
        print(f"Route: {rule} -> {rule.endpoint}")
    # NOTE: Remove db.create_all() in production; use migrations instead
    # db.create_all()  
# ---------------------------------------------

# Run the Flask app
if __name__ == '__main__':
    # DEBUG=False in production
    app.run(debug=True, port=5001, host='0.0.0.0')
