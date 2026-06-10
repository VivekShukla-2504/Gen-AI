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

---

##  Project Status & Recent Updates

> **Note on Feature Roadmap:** Following initial presentations and LinkedIn updates, this repository undergoes active continuous integration. Certain features may be iteratively added, modified, or deprecated to improve efficiency.

###  What's New?
* **Model Optimization:** Upgraded the underlying core AI architecture from `Gemini 1.5 Flash` to the more robust and responsive `Gemini 2.5 Flash` for faster response grading and precise feedback generation.
* **Security Hardening:** Patched API endpoint validation layers, optimized route guarding structures, and enhanced session-token sanitization protocols.
* **Feature Iterations:** UI state-sync mechanisms and backend logging modules have been updated based on post-launch tests.

---

##  Important Usage Notes

* **Language Preference:** The AI Core processing engine is optimized to evaluate inputs in **English**. For accurate scoring, dynamic contextual question-responses, and technical dashboard reports, please ensure interviews are conducted in English.


