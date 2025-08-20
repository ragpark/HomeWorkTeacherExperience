const express = require('express');
const { getSqlPool } = require('./db/azureSqlClient');
const cosmosClient = require('./db/cosmosClient');
const { generateRecommendations } = require('./recommendation');

const app = express();
app.use(express.json());

// GET /api/academic-calendar
app.get('/api/academic-calendar', async (req, res) => {
  try {
    const pool = await getSqlPool();
    const result = await pool.request().query('SELECT * FROM AcademicCalendar');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
