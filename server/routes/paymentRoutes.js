// server/routes/paymentRoutes.js
const express = require('express');
const { purchaseCredit } = require('../controllers/paymentController');

const router = express.Router();

// This route handles buying a credit. 
// It calls the 'purchaseCredit' function from 'paymentController.js'.
router.post('/buy-credit', purchaseCredit);

module.exports = router;
