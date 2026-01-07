# Agathees - AI-Powered Task Manager

A smart task management application that uses OpenAI to automatically prioritize daily tasks based on urgency and complexity using the Eisenhower Matrix.

## Features

- 🤖 **AI-Powered Analysis**: Natural Language Processing to understand task context and automatically determine urgency and importance
- 📊 **Eisenhower Matrix**: Automatic priority sorting into four quadrants:
  - **Q1: Do First** - Urgent and Important
  - **Q2: Schedule** - Important but Not Urgent
  - **Q3: Delegate** - Urgent but Not Important
  - **Q4: Eliminate** - Neither Urgent nor Important
- 🎨 **Beautiful Pale Pink Theme**: Light, elegant pale pink color scheme with dark mode support
- 📱 **Mobile-Responsive**: Fully responsive design that works on all devices
- 🔄 **Real-time Sync**: WebSocket-based real-time synchronization across devices
- 🔐 **User Authentication**: Secure JWT-based authentication system

## Tech Stack

### Backend
- **Python** with Django
- **Django REST Framework** for API
- **MongoDB** (via mongoengine) for database
- **Django Channels** for WebSocket support
- **OpenAI API** for task analysis
- **Redis** for WebSocket channel layer

### Frontend
- **React** with Vite
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Axios** for API calls
- **WebSocket** for real-time updates

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud instance)
- Redis (for WebSocket support)
- OpenAI API key

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   
   MONGODB_HOST=localhost
   MONGODB_PORT=27017
   MONGODB_DB_NAME=agathees_db
   MONGODB_USERNAME=
   MONGODB_PASSWORD=
   
   OPENAI_API_KEY=your-openai-api-key-here
   
   REDIS_URL=redis://localhost:6379/0
   
   JWT_SECRET_KEY=your-jwt-secret-key-here
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

5. **Run database migrations (for Django auth):**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional, for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

   The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_WS_URL=ws://localhost:8000/ws/tasks/
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy)

### MongoDB Setup

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start manually:
mongod
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Redis Setup

**Windows:**
Download and install Redis from [redis.io](https://redis.io/download) or use WSL.

**macOS (with Homebrew):**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

## Usage

1. **Start all services:**
   - MongoDB
   - Redis
   - Django backend (`python manage.py runserver`)
   - React frontend (`npm run dev`)

2. **Access the application:**
   - Open `http://localhost:5173` in your browser
   - Register a new account or login
   - Create tasks with natural language descriptions
   - The AI will automatically analyze and prioritize your tasks

3. **Creating Tasks:**
   - Click "New Task" button
   - Enter a task title (required)
   - Optionally add a description in natural language
   - The AI will analyze the description and assign urgency/importance scores
   - Tasks are automatically sorted by priority

4. **Managing Tasks:**
   - Edit tasks by clicking the edit icon
   - Change task status (Pending, In Progress, Completed, Cancelled)
   - Re-analyze tasks with AI using the 🤖 button
   - Delete tasks using the 🗑️ button

5. **Theme Toggle:**
   - Click the theme toggle button (🌙/☀️) to switch between light and dark modes

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/profile/` - Get current user profile

### Tasks
- `GET /api/tasks/` - List all tasks for authenticated user
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get task details
- `PATCH /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task
- `POST /api/tasks/{id}/reanalyze/` - Re-analyze task with AI

### WebSocket
- `ws://localhost:8000/ws/tasks/` - WebSocket endpoint for real-time updates

## Project Structure

```
agathees-task-manager/
├── backend/
│   ├── config/          # Django project settings
│   ├── tasks/           # Tasks app (models, views, AI service)
│   ├── users/           # Users app (authentication)
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API and WebSocket services
│   │   ├── hooks/       # Custom React hooks
│   │   ├── context/     # React context providers
│   │   └── styles/      # CSS files
│   └── package.json
└── README.md
```

## Features in Detail

### AI Task Analysis
When you create a task with a description, the application sends it to OpenAI's GPT-3.5-turbo model, which analyzes:
- **Urgency** (1-4 scale): Based on deadlines, time-sensitivity, immediate consequences
- **Importance** (1-4 scale): Based on long-term impact, strategic value, goal alignment

### Eisenhower Matrix
Tasks are automatically categorized into four quadrants:
- **Q1 (Do First)**: High urgency + High importance - Handle immediately
- **Q2 (Schedule)**: Low urgency + High importance - Plan and schedule
- **Q3 (Delegate)**: High urgency + Low importance - Delegate if possible
- **Q4 (Eliminate)**: Low urgency + Low importance - Consider eliminating

### Real-time Sync
Using WebSocket connections, all task changes (create, update, delete) are instantly synchronized across all devices where you're logged in.

## Troubleshooting

### Backend Issues
- **MongoDB connection error**: Ensure MongoDB is running and connection details in `.env` are correct
- **Redis connection error**: Ensure Redis is running
- **OpenAI API error**: Check that your API key is valid and has credits

### Frontend Issues
- **CORS errors**: Ensure `CORS_ALLOWED_ORIGINS` in Django settings includes your frontend URL
- **WebSocket connection failed**: Check that Redis is running and WebSocket URL is correct

## Development

### Running Tests
```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Agathees** - Making task management smarter, one AI analysis at a time! 🚀

