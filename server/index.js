const app = require('./app');

const PORT = process.env.PORT || 3001;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`The Intelligent Bistro API running on port ${PORT}`);
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn(
        'WARNING: ANTHROPIC_API_KEY is not set. Add it to server/.env before sending chat messages.',
      );
    }
  });
}

module.exports = app;
