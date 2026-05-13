const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/order');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'intelligent-bistro-api',
    hasKey: !!process.env.ANTHROPIC_API_KEY,
    time: new Date().toISOString(),
  });
});

app.use('/api', orderRoutes);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal error', details: err.message });
});

module.exports = app;
