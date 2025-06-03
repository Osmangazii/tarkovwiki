const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { findByUsername, createUser } = require('../models/user');
require('dotenv').config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log('Register request received:', { email, username });

    if (!email || !username || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Tüm alanlar zorunlu.' });
    }

    // Check if user already exists
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, user) => {
      if (err) {
        console.error('Database error while checking existing user:', err);
        return res.status(500).json({ message: 'Veritabanı hatası.' });
      }

      if (user) {
        console.log('User already exists:', { username, email });
        return res.status(400).json({ message: 'Kullanıcı adı veya email zaten kayıtlı.' });
      }

      // Hash password and create user
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Şifre hashleme hatası.' });
        }

        createUser(email, username, hash, (err, userId) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Kullanıcı oluşturulamadı.' });
          }
          console.log('User created successfully:', { userId, username });
          res.status(201).json({ message: 'Kayıt başarılı.' });
        });
      });
    });
  } catch (error) {
    console.error('Unexpected error in register route:', error);
    res.status(500).json({ message: 'Beklenmeyen bir hata oluştu.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login request received:', { username });

    if (!username || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı ve şifre zorunlu.' });
    }

    findByUsername(username, (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).json({ message: 'Veritabanı hatası.' });
      }

      if (!user) {
        console.log('User not found:', username);
        return res.status(400).json({ message: 'Geçersiz bilgiler.' });
      }

      bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Şifre karşılaştırma hatası.' });
        }

        if (!isMatch) {
          console.log('Password mismatch for user:', username);
          return res.status(400).json({ message: 'Geçersiz bilgiler.' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        console.log('Login successful:', { username });
        res.json({ token, username: user.username });
      });
    });
  } catch (error) {
    console.error('Unexpected error in login route:', error);
    res.status(500).json({ message: 'Beklenmeyen bir hata oluştu.' });
  }
});

module.exports = router; 