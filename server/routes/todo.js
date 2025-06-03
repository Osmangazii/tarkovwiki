const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's todo tasks
router.get('/', auth, (req, res) => {
  console.log('Getting todo tasks for user:', req.user.id);
  db.all('SELECT task_id FROM user_tasks WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      console.error('Error getting todo tasks:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    console.log('Found todo tasks:', rows);
    res.json({ todoTasks: rows.map(r => r.task_id) });
  });
});

// Add a task to todo
router.post('/', auth, (req, res) => {
  const { taskId } = req.body;
  console.log('Adding task to todo:', { userId: req.user.id, taskId });

  if (!taskId) {
    console.error('No taskId provided');
    return res.status(400).json({ message: 'Task ID is required' });
  }

  db.get('SELECT * FROM user_tasks WHERE user_id = ? AND task_id = ?', [req.user.id, taskId], (err, row) => {
    if (err) {
      console.error('Error checking existing task:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    if (row) {
      console.log('Task already in todo:', row);
      return res.json({ message: 'Task already in todo' });
    }

    db.run('INSERT INTO user_tasks (user_id, task_id) VALUES (?, ?)', [req.user.id, taskId], function(err) {
      if (err) {
        console.error('Error adding task to todo:', err);
        return res.status(500).json({ message: 'DB error' });
      }
      console.log('Task added successfully:', { userId: req.user.id, taskId });
      res.json({ message: 'Task added' });
    });
  });
});

// Remove a task from todo
router.delete('/:taskId', auth, (req, res) => {
  const { taskId } = req.params;
  console.log('Removing task from todo:', { userId: req.user.id, taskId });

  db.run('DELETE FROM user_tasks WHERE user_id = ? AND task_id = ?', [req.user.id, taskId], function(err) {
    if (err) {
      console.error('Error removing task from todo:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    console.log('Task removed successfully:', { userId: req.user.id, taskId });
    res.json({ message: 'Task removed' });
  });
});

module.exports = router; 