// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  borrowBook,
  returnBook,
  getAllTransactions,
  getMyTransactions,
} = require('../controllers/transactionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// User can borrow
router.post('/borrow', verifyToken, borrowBook);
// User can return
router.post('/return', verifyToken, returnBook);

// The important line for MyBorrows
router.get('/mine', verifyToken, getMyTransactions);

// Admin can see all
router.get('/', verifyToken, isAdmin, getAllTransactions);

module.exports = router;
