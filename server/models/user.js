const db = require('../db');

const findByUsername = (username, cb) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Error finding user by username:', err);
      return cb(err);
    }
    cb(null, row);
  });
};

const findById = (id, cb) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error finding user by id:', err);
      return cb(err);
    }
    cb(null, row);
  });
};

const createUser = (email, username, passwordHash, cb) => {
  console.log('Creating user with:', { email, username });
  
  // First check if user exists
  db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (err, existingUser) => {
    if (err) {
      console.error('Error checking existing user:', err);
      return cb(err);
    }

    if (existingUser) {
      const error = new Error('User already exists');
      error.code = 'USER_EXISTS';
      return cb(error);
    }

    // If user doesn't exist, create new user
    const sql = 'INSERT INTO users (email, username, passwordHash) VALUES (?, ?, ?)';
    console.log('Executing SQL:', sql);
    
    db.run(sql, [email, username, passwordHash], function(err) {
      if (err) {
        console.error('Error creating user:', err);
        return cb(err);
      }
      console.log('User created successfully with ID:', this.lastID);
      cb(null, this.lastID);
    });
  });
};

module.exports = { findByUsername, findById, createUser }; 