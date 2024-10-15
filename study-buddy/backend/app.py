from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from routes import api_bp
        app.register_blueprint(api_bp)
        db.create_all()  # Create database tables

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
