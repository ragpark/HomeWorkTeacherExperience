const express = require('express');
const { getSqlPool } = require('./db/azureSqlClient');
const cosmosClient = require('./db/cosmosClient');
const { generateRecommendations } = require('./recommendation');
const lti = require('./lti');
const logger = require('./logger');
const appInsights = require('applicationinsights');

if (process.env.APPINSIGHTS_CONNECTION_STRING) {
  appInsights
    .setup(process.env.APPINSIGHTS_CONNECTION_STRING)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setSendLiveMetrics(false)
    .start();
}

const app = express();
app.use(express.json());

// Mount ltijs express app to handle LTI 1.3 login and launch endpoints
app.use('/lti', lti.app);

// Endpoint to receive logs from frontend
app.post('/api/logs', (req, res) => {
  const { level = 'info', message, stack } = req.body || {};
  if (logger[level]) {
    logger[level]({ message, stack });
  } else {
    logger.info({ message, stack });
  }
  res.sendStatus(204);
});

// GET /api/academic-calendar
app.get('/api/academic-calendar', async (req, res) => {
  try {
    const pool = await getSqlPool();
    const result = await pool.request().query('SELECT * FROM AcademicCalendar');
    res.json(result.recordset);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Failed to fetch academic calendar' });
  }
});

// GET /api/students
app.get('/api/students', async (req, res) => {
  try {
    const pool = await getSqlPool();
    const result = await pool.request().query('SELECT * FROM Students');
    res.json(result.recordset);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /api/recommendations
app.post('/api/recommendations', async (req, res) => {
  try {
    const { ability, week } = req.body;
    const recommendations = await generateRecommendations(ability, week, cosmosClient);
    res.json(recommendations);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Grade passback endpoint
lti.app.post('/grade', async (req, res) => {
  try {
    // Send grade using ltijs Grade Service
    const gradeService = await lti.Grade.getService(req);
    await gradeService.sendScore({
      userId: req.body.userId,
      scoreGiven: req.body.score,
      scoreMaximum: req.body.maxScore || 100,
      activityProgress: 'Completed',
      gradingProgress: 'FullyGraded'
    });
    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Failed to passback grade' });
  }
});

// Names & Roles service endpoint
lti.app.get('/names', async (req, res) => {
  try {
    const nrps = await lti.NamesAndRoles.getService(req);
    const members = await nrps.getMembers();
    res.json(members);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Failed to fetch roster' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

module.exports = app;
