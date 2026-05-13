require('dotenv').config();
const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/order');

const app = express();
app.use(cors());
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`The Intelligent Bistro API running on port ${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      'WARNING: ANTHROPIC_API_KEY is not set. Add it to server/.env before sending chat messages.',
    );
  }
});
