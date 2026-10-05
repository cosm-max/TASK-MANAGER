# Task Manager App

A simple, beginner-friendly task manager built with Node.js, Express, and the built-in File System (`fs`) module. No databases are used; tasks are saved locally as `.txt` files.

## Features
- Create tasks with a title and description.
- View all tasks as cards with a short preview.
- Read full task details in a responsive popup modal.
- Fully responsive dark-themed UI optimized for mobile and desktop.
- Input validation and basic security to prevent path traversal.

## Requirements
- Node.js (v14 or higher recommended)

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

## API Routes

- **`GET /tasks`**
  - Fetches all saved tasks from the `tasks` directory. Returns an array of objects containing `id`, `title`, and a short `preview` of the description.

- **`GET /tasks/:id`**
  - Fetches the full details of a specific task by its unique ID. Returns the full `title` and `description`.

- **`POST /tasks`**
  - Creates a new task. Expects a JSON body with `title` and `description`. Saves the task as a `.txt` file in the `tasks` directory and returns the newly created task's ID.
