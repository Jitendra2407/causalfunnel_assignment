# CausalFunnel Quiz Application 🧠

A professional, robust, and responsive Quiz Application built with **Next.js**. This project was developed as part of the CausalFunnel Software Engineer Intern assessment. It demonstrates modern web development practices, including dynamic data fetching, complex state management, and user-centric design.

## 🚀 Features & Highlights

### Core Requirements
*   **Start Page**: Clean interface for users to enter their email and begin the session.
*   **Dynamic Questions**: Fetches 15 random questions from the [OpenTDB API](https://opentdb.com/), ensuring a new challenge every time.
*   **Timer System**: Integrated 30-minute countdown timer that automatically submits the quiz when time runs out. ⏳
*   **Smart Navigation**: 
    *   **Jump & Skip**: Users can navigate to any question at any time using the Navigation Panel.
    *   **Visual Tracking**: Color-coded indicators show exactly which questions are **Current**, **Visited**, and **Attempted**.
*   **Performance Report**: Detailed end-of-game report comparing user answers side-by-side with correct answers.
*   **Clean Code**: Modular architecture with descriptive comments and type-safe practices.

### 🌟 Bonus Features Check
*   **Device Adaptability**: Fully responsive design that looks great on Mobile 📱, Tablet 📲, and Desktop 💻.
*   **Smooth Animations**: Implemented subtle fade-in transitions for questions and interactive hover effects.
*   **🛡️ Session Persistence (Anti-Cheat / Resilience)**: 
    *   **Robust Data Saving**: Quiz state (answers, time remaining, current question) is real-time saved to `localStorage`.
    *   **Refresh Protection**: If a user accidentally reloads the page (or closes the tab), they can jump right back in exactly where they left off! No lost progress.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **State Management**: React Context API + LocalStorage
*   **Languages**: JavaScript (ES6+)
*   **Tools**: ESLint for code quality

## 📦 Setup & Installation

Follow these steps to get the application running on your local machine:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Jitendra2407/causalfunnel_assignment.git
    cd causalfunnel_assignment
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the application**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Assumptions

1.  **Internet Connection**: The application relies on the external OpenTDB API. An active internet connection is required to fetch questions.
2.  **Browser Support**: The application is optimized for modern evergreen browsers (Chrome, Firefox, Safari, Edge).
3.  **API Rate Limits**: We assume the API is available. Basic error handling is implemented to allow users to "Retry" if the fetch fails.

## 🧩 Challenges & Solutions

### 1. Handling HTML Entities in API Data
**Challenge**: The OpenTDB API returns raw HTML entities (e.g., `&quot;`, `&#039;`) in the JSON response.
**Solution**: I implemented a utility function `decodeHTML` that uses a temporary DOM element to accurately parse and decode these entities before rendering, ensuring clean text for the user.

### 2. Session Persistence & Race Conditions
**Challenge**: Implementing a robust "Resume Quiz" feature that survives a page refresh. A race condition occurred where the app would try to fetch new questions *before* the saved session data was fully restored from LocalStorage.
**Solution**: 
*   Implemented a coordinated `initializing` state in `QuizContext`.
*   The `QuizPage` now waits for the Context to signal that the storage check is complete before deciding whether to load existing data or fetch new questions. This ensures a seamless "pick up where you left off" experience.

### 3. State Complexity
**Challenge**: Managing multiple moving parts (timer, visited set, answers map, current index) without prop drilling.
**Solution**: Centralized logic in `QuizContext`. Used a `Set` for efficient lookups of visited questions and a `Map` (object) for answers to handle sparse updates easily.

---
**Submission for CausalFunnel Interview Process**
