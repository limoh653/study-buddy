# study-buddy

## Description
A full-stack web application to help students connect and collaborate through study groups.

## Getting Started

### Prerequisites
- Python 3.x
- Node.js
- npm or yarn

### Backend Setup
1. Navigate to the `backend` directory.
2. Install the required packages:
   ```bash
   pip install -r requirements.txt
Run the Flask application:
bash
Copy code
python app.py
Frontend Setup
Navigate to the frontend directory.
Install the required packages:
bash
Copy code
npm install
Run the React application:
bash
Copy code
npm start
API Endpoints
POST /api/register: Register a new user.
POST /api/login: Log in a user and receive a JWT token.
POST /api/groups: Create a new study group (requires JWT).
GET /api/groups: Retrieve all study groups (requires JWT).
POST /api/groups/int:group_id/messages: Send a message in a specific group (requires JWT).
GET /api/groups/int:group_id/messages: Get all messages in a specific group (requires JWT).
markdown
Copy code

### Testing the Application

1. **Set Up the Backend**:
   - Ensure Flask is running without errors.
   - Check that the database is created (you should see `database.db` in the `backend` folder).

2. **Set Up the Frontend**:
   - Ensure the React application runs without issues.
   - Use tools like Postman or Insomnia to test your API endpoints.

3. **Run the Application**:
   - Register a user through the registration form.
   - Log in to receive a JWT token.
   - Create and view study groups.

4. **Debugging**:
   - Check console logs for errors.
   - Ensure that all required dependencies are installed.