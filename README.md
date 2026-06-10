# GEN-AI Based AI Interview Platform

An advanced, full-stack Intelligent AI Interview Platform designed to automate and streamline the technical interview process. The application leverages Generative AI to conduct smart technical interviews, assess candidate responses dynamically, and generate comprehensive evaluation reports.



##  Key Features

###  Authentication & Security
* **Secure Auth:** JWT-based authentication with cookie/token mechanisms.
* **Session Management:** Built-in token blacklisting for secure logouts.
* **Protected Routes:** Separate layouts and route guards for authenticated sessions.

###  AI Interview Engine
* **Dynamic Question Generation:** Generates contextual technical questions using Generative AI based on user profiles or core concepts.
* **Real-time Assessment:** Evaluates user answers intelligently on the fly.
* **Comprehensive Reporting:** Generates a structured `interviewReport` with feedback, score, and areas of improvement.

###  Modern Tech Stack
* **Frontend:** React.js (Vite), React Context API for State Management, SCSS for structured component-driven styling.
* **Backend:** Node.js, Express.js, MVC Architecture.
* **Database:** MongoDB (Mongoose Object Modeling).

---

##  Project Architecture & Working Flow

The system follows a decoupled **Client-Server Architecture** communicating via RESTful APIs.

       +--------------------------------------------+
       |               React Frontend               |
       |  (Pages, Features, Context, Custom Hooks)  |
       +---------------------+----------------------+
                             |
                      REST API (JSON)
                             |
                             v
       +---------------------+----------------------+
       |            Express.js Backend              |
       |  (Routing -> Middleware -> Controllers)   |
       +---------------------+----------------------+
                             |
               +-------------+-------------+
               |                           |
               v                           v
     +-----------------+          +-----------------+
     |  MongoDB Atlas  |          |  Generative AI  |
     | (User/Reports)  |          |    Service      |
     +-----------------+          +-----------------+

How It Works:
User Auth: User registers/logs in through the auth feature. The session token is handled securely.

Session Initialization: When a user starts an interview, a secure session triggers the backend interview.controller.js.

AI Core Processing: The ai.service.js connects with the Generative AI engine to fetch tailored technical problems.

Submission & Grading: The user inputs their response via the Frontend interface. The response passes through validation middlewares, gets evaluated by the AI service, and the metrics are saved safely in the interviewReport collection inside MongoDB.

Necessary Folder Structure 
The repository is cleanly divided into decoupled sub-systems for modular scalability:


Installation & Setup
Prerequisites
Node.js (v18+ recommended)

MongoDB Local or MongoDB Atlas URI

AI API Credentials

Backend Setup
Navigate to the backend folder:

Bash
cd BACKEND
Install dependencies:

Bash
npm install
Create a .env file in the root of the BACKEND directory and add your keys:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AI_API_KEY=your_gen_ai_api_key
Start the server:

Bash
npm run dev # or node server.js
Frontend Setup
Navigate to the frontend folder:

Bash
cd ../Frontend
Install dependencies:

Bash
npm install
Start the Vite development server:

Bash
npm run dev

API Endpoints Preview

Endpoint                Method              Description                       Auth Required
/api/auth/register	    POST	      Registers a new user	                        No
/api/auth/login       	POST	      Logs in user & issues token                 	No
/api/interview/start  	POST	      Initializes AI interview session	            Yes
/api/interview/submit  	POST	      Processes response & generates AI report    	Yes

