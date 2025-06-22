const express = require('express');
const router = express.Router();
const hideoutData = require('../data/hideout_data.json');
const db = require('../db');
const auth = require('../middleware/auth');

// Hideout verilerini getir
router.get('/', (req, res) => {
  res.json(hideoutData);
});

// Kullanıcı ilerlemesini getir
router.get('/progress', auth, (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Yetkilendirme gerekli' });
  }

  db.all('SELECT module_id, level, target_level FROM hideout_progress WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      console.error('Hideout progress error:', err);
      return res.status(500).json({ message: 'Veritabanı hatası' });
    }

    const progress = {};
    rows.forEach(row => {
      progress[row.module_id] = {
        current_level: row.level,
        target_level: row.target_level
      };
    });

    res.json(progress);
  });
});

// Kullanıcı ilerlemesini güncelle
router.post('/progress', auth, (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    console.log('Hideout progress POST: user not authenticated');
    return res.status(401).json({ message: 'Yetkilendirme gerekli' });
  }

  const { moduleId, current_level, target_level } = req.body;
  console.log('Hideout progress POST received:', { userId, moduleId, current_level, target_level });
  if (!moduleId || (current_level === undefined && target_level === undefined)) {
    console.log('Hideout progress POST: invalid data');
    return res.status(400).json({ message: 'Geçersiz veri' });
  }

  // Önce mevcut kaydı kontrol et
  db.get('SELECT * FROM hideout_progress WHERE user_id = ? AND module_id = ?', [userId, moduleId], (err, row) => {
    if (err) {
      console.error('Hideout progress select error:', err);
      return res.status(500).json({ message: 'Veritabanı hatası' });
    }

    let newCurrent = current_level;
    let newTarget = target_level;
    if (row) {
      if (newCurrent === undefined) newCurrent = row.level;
      if (newTarget === undefined) newTarget = row.target_level;
    } else {
      if (newCurrent === undefined) newCurrent = 0;
      if (newTarget === undefined) newTarget = 0;
    }

    console.log('Hideout progress INSERT/REPLACE:', { userId, moduleId, newCurrent, newTarget });

    db.run(
      'INSERT OR REPLACE INTO hideout_progress (user_id, module_id, level, target_level) VALUES (?, ?, ?, ?)',
      [userId, moduleId, newCurrent, newTarget],
      (err) => {
        if (err) {
          console.error('Hideout progress update error:', err);
          return res.status(500).json({ message: 'Veritabanı hatası' });
        }
        console.log('Hideout progress updated successfully!', { userId, moduleId, newCurrent, newTarget });
        res.json({ success: true });
      }
    );
  });
});

module.exports = router; 