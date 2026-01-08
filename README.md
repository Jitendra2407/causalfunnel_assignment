# CausalFunnel Quiz Application

A robust, responsive, and interactive Quiz Application built with **Next.js**. This application allows users to take a timed quiz with questions fetched dynamically from an external API, track their progress, and view a detailed performance report.

## 🚀 Features

*   **Dynamic Data**: Fetches 15 random questions from the [OpenTDB API](https://opentdb.com/).
*   **Timed Quiz**: Integrated 30-minute countdown timer with auto-submit functionality.
*   **Interactive Navigation**: 
    *   Jump to any question via the Navigation Panel.
    *   Visual indicators for **Visited**, **Attempted**, and **Current** questions.
*   **State Management**: 
    *   Persists user session (email) via LocalStorage.
    *   Global state management (Answers, Timer, Progress) using React Context API.
*   **Responsive Design**: Optimized for both Desktop and Mobile devices.
*   **Smooth UX**: Animated transitions and intuitive UI.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **State Management**: React Context API
*   **API**: [Open Trivia DB (OpenTDB)](https://opentdb.com/)
*   **Language**: JavaScript (ES6+)

## 📦 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Jitendra2407/causalfunnel_assignment.git
    cd causalfunnel_assignment
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the application**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

The project follows a modular structure using the Next.js App Router:

*   **`src/app/`**: Routes (Pages)
    *   `page.js`: Start page (Email capture).
    *   `quiz/page.js`: Main game loop (Timer, Questions, Nav).
    *   `report/page.js`: Results and score analysis.
*   **`src/components/`**: Reusable UI components.
    *   `quiz/`: Specialized components (`Timer`, `QuestionCard`, `NavPanel`).
    *   `ui/`: Generic components (`Button`, `Input`).
*   **`src/context/`**: Global State (`QuizContext`) handling logic for scoring, timer, and API fetching.

## 📝 Assumptions

1.  **API Availability**: The application relies on OpenTDB. If the API is down, an error message is displayed with a "Retry" option.
2.  **User Identity**: Email is used as the primary identifier for the session. It is stored in `localStorage` to allow page refreshes without losing the session context (though quiz progress resets on full refresh to prevent cheating, the user doesn't need to re-login).
3.  **Single Choice**: Questions are multiple-choice with a single correct answer.

## 🧩 Challenges & Solutions

*   **Challenge**: The OpenTDB API returns HTML entities (e.g., `&quot;`) in the text.
    *   **Solution**: Implemented a `decodeHTML` utility function using a temporary DOM element (or a robust regex approach) to sanitize text before display.

*   **Challenge**: Handling Page Refreshes.
    *   **Solution**: Since state is in-memory (Context), a refresh clears the questions. Added a guard in `QuizPage` to detect "Active Session but Empty Questions" which triggers an automatic re-fetch, ensuring the user isn't stuck on a blank screen.

*   **Challenge**: "Visited" vs "Attempted" Logic.
    *   **Solution**: Used a `Set` for `visited` indices (updated via `useEffect` on question change) and a key-value map for `answers` to track attempted questions.

---
**Author**: Candidate
