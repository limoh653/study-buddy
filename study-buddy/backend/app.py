from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate  # Import Flask-Migrate
from routes import api_blueprint
from extensions import db  # Import from extensions
import config

app = Flask(__name__)
app.config.from_object(config.Config)
db.init_app(app)
jwt = JWTManager(app)
CORS(app)

# Set up Flask-Migrate
migrate = Migrate(app, db)  # Initialize Flask-Migrate

app.register_blueprint(api_blueprint)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
