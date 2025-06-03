const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Get the absolute path for the database file
const dbPath = path.resolve(__dirname, 'tarkovwiki.sqlite');
console.log('Database path:', dbPath);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables if they don't exist
db.serialize(() => {
  // Create users table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created successfully');
    }
  });

  // Create user tasks table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS user_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_id INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating user_tasks table:', err);
    } else {
      console.log('User tasks table created successfully');
    }
  });
});

// Test database connection and tables
db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
  if (err) {
    console.error('Error checking database tables:', err);
  } else {
    console.log('Database tables:', row);
  }
});

module.exports = db; 