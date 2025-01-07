// backend/controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// Borrow a book (user only)
exports.borrowBook = async (req, res) => {
  try {
    const { bookID } = req.body;
    const userID = req.user.userId; // from JWT (authMiddleware)

    // Check if book exists
    const book = await Book.findById(bookID);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    // Check availability
    if (!book.availabilityStatus) {
      return res.status(400).json({ error: 'Book is currently unavailable' });
    }

    // Create a transaction
    const transaction = await Transaction.create({ bookID, userID });
    return res.status(201).json({
      message: 'Book borrowed successfully',
      transaction, // include the entire transaction object
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { transactionID } = req.body;
    const userID = req.user.userId; // from JWT

    // Check if the transaction belongs to the logged-in user
    const transaction = await Transaction.findOne({
      _id: transactionID,
      userID,
    }).populate('bookID');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found for this user' });
    }

    // Check if already returned
    if (transaction.returnDate) {
      return res.status(400).json({ error: 'Book already returned' });
    }

    // Mark as returned
    transaction.returnDate = new Date();
    await transaction.save();

    // Make book available again
    const book = transaction.bookID;
    book.availabilityStatus = true;
    await book.save();

    return res.status(200).json({
      message: 'Book returned successfully',
      transaction,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get all transactions (ADMIN ONLY)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('bookID')
      .populate('userID');
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


// Get only the logged-in user's transactions
exports.getMyTransactions = async (req, res) => {
  try {
    // 1. userID is set by verifyToken (req.user.userId)
    console.log('[DEBUG] getMyTransactions => userID:', req.user.userId);

    // 2. find all transactions with userID
    const myTransactions = await Transaction.find({ userID: req.user.userId })
      .populate('bookID')  // so we can access bookID.title, etc.
      .populate('userID'); // if you want user details

    console.log('[DEBUG] Found transactions:', myTransactions);

    // 3. return them
    return res.status(200).json(myTransactions);
  } catch (error) {
    console.error('[DEBUG] Error in getMyTransactions:', error);
    return res.status(400).json({ error: error.message });
  }
};

  
