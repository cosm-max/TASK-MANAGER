const express = require('express');
const fs = require('fs').promises; // Use fs promises for cleaner async code
const path = require('path');
const crypto = require('crypto'); // Built-in for unique IDs

const app = express();
const PORT = 3000;
const TASKS_DIR = path.join(__dirname, 'tasks');

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static('public'));

// Ensure the tasks directory exists when the server starts
async function ensureDir() {
    try {
        await fs.mkdir(TASKS_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating tasks directory:', error);
    }
}
ensureDir();

// GET /tasks - Read all saved tasks
app.get('/tasks', async (req, res) => {
    try {
        const files = await fs.readdir(TASKS_DIR);
        const tasks = [];
        
        for (const file of files) {
            // Only process .txt files
            if (file.endsWith('.txt')) {
                const id = file.replace('.txt', '');
                const content = await fs.readFile(path.join(TASKS_DIR, file), 'utf-8');
                
                // Extract title for the preview
                const lines = content.split('\n');
                const title = lines[0];
                // Description starts from the 3rd line (index 2), we extract a preview
                const preview = lines.slice(2).join('\n').substring(0, 50) + '...';
                
                tasks.push({ id, title, preview });
            }
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read tasks.' });
    }
});

// GET /tasks/:id - Read a specific task
app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    
    // Basic validation to prevent directory traversal (only allow letters, numbers, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        return res.status(400).json({ error: 'Invalid task ID format.' });
    }
    
    try {
        const filePath = path.join(TASKS_DIR, `${id}.txt`);
        const content = await fs.readFile(filePath, 'utf-8');
        
        const lines = content.split('\n');
        const title = lines[0];
        const description = lines.slice(2).join('\n'); // Description starts after the blank line
        
        res.json({ id, title, description });
    } catch (error) {
        res.status(404).json({ error: 'Task not found.' });
    }
});

// POST /tasks - Save a new task
app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    
    // Validate input to ensure fields aren't empty
    if (!title || !description || title.trim() === '' || description.trim() === '') {
        return res.status(400).json({ error: 'Title and description are required.' });
    }
    
    // Generate a unique ID for the task using Node's crypto
    const id = crypto.randomUUID();
    const filePath = path.join(TASKS_DIR, `${id}.txt`);
    
    // Format: Title, blank line, then description
    const fileContent = `${title}\n\n${description}`;
    
    try {
        await fs.writeFile(filePath, fileContent);
        res.status(201).json({ id, title, message: 'Task created successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save task.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
