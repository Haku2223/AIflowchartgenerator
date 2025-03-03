// server/routes/flowchartRoutes.js
const express = require('express');
const { generateFlowchartController } = require('../controllers/flowchartController');

const router = express.Router();

// POST /api/flowcharts/generate
router.post('/generate', generateFlowchartController);

module.exports = router;
