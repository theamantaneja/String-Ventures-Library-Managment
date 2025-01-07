// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  listByAvailability,
} = require('../controllers/bookController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// CRUD
router.post('/', verifyToken, isAdmin, addBook);   // Only admins can add
router.get('/', getAllBooks);
router.get('/availability', listByAvailability);   // ?available=true or false
router.get('/:id', getBookById);
router.put('/:id', verifyToken, isAdmin, updateBook);
router.delete('/:id', verifyToken, isAdmin, deleteBook);

module.exports = router;
