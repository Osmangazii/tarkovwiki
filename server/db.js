const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Get the absolute path for the database file
const dbPath = path.join(__dirname, 'tarkov.db');
console.log('Database path:', dbPath);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

function createTables() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    )`);

    // Todos table
    db.run(`CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quest_id TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Hideout progress table
    db.run(`CREATE TABLE IF NOT EXISTS hideout_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      module_id TEXT NOT NULL,
      level INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id),
      UNIQUE(user_id, module_id)
    )`);

    // User tasks table
    db.run(`CREATE TABLE IF NOT EXISTS user_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_id TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
  });
}

// Test database connection and tables
db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
  if (err) {
    console.error('Error checking database tables:', err);
  } else {
    console.log('Database tables:', row);
  }
});

module.exports = db; 