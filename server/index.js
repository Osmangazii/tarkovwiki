require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');
const hideoutRoutes = require('./routes/hideout');
const { createClient } = require('redis');
const redisClient = createClient({ url: 'redis://localhost:6379' });
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();
const { sendToQueue } = require('./rabbit');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: [
    'https://tarkovwiki.vercel.app',
    'https://tarkovwiki-1.vercel.app', // Vercel’in sana verdiği gerçek domain
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use('/api/auth', authRoutes);

// /api/todo endpointini override et
const db = require('./db');
const auth = require('./middleware/auth');

app.get('/api/todo', auth, async (req, res) => {
  const userId = req.user.id;
  const cacheKey = `todo:${userId}`;
  try {
    // Önce Redis'te var mı bak
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log('Görev listesi Redis cache üzerinden döndü.');
      return res.json({ todoTasks: JSON.parse(cached) });
    }
    // Yoksa veritabanından çek
    db.all('SELECT task_id, completed FROM user_tasks WHERE user_id = ?', [userId], async (err, rows) => {
      if (err) {
        console.error('Error getting todo tasks:', err);
        return res.status(500).json({ message: 'DB error' });
      }
      // Redis'e yaz
      await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 60 }); // 60 sn cache
      console.log('Görev listesi veritabanından çekildi ve Redis cachelendi.');
      res.json({ todoTasks: rows });
    });
  } catch (err) {
    // Redis hatası olursa fallback olarak veritabanından çek
    db.all('SELECT task_id, completed FROM user_tasks WHERE user_id = ?', [userId], (err, rows) => {
      if (err) {
        console.error('Error getting todo tasks:', err);
        return res.status(500).json({ message: 'DB error' });
      }
      res.json({ todoTasks: rows });
    });
  }
});

app.use('/api/todo', todoRoutes);
app.use('/api/hideout', hideoutRoutes);

app.get('/api/rabbit-test', async (req, res) => {
  await sendToQueue('test_queue', JSON.stringify({ message: 'Merhaba RabbitMQ!' }));
  res.json({ success: true, message: 'Mesaj RabbitMQ kuyruğuna gönderildi!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
}); 