// backend/controllers/bookController.js
const Book = require('../models/Book');

exports.addBook = async (req, res) => {
  try {
    const { title, author, publicationYear } = req.body;
    const newBook = await Book.create({ title, author, publicationYear });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, publicationYear, availabilityStatus } = req.body;
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, publicationYear, availabilityStatus },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
    console.log("deleting book");
    try {
        console.log("deleting book");
      const bookId = req.params.id;
      const deleted = await Book.findByIdAndDelete(bookId);
      if (!deleted) {
        return res.status(404).json({ error: 'Book not found' });
      }
      return res.status(200).json({ message: 'Book deleted successfully', bookId });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

exports.listByAvailability = async (req, res) => {
  try {
    const availableOnly = req.query.available === 'true';
    const books = await Book.find({ availabilityStatus: availableOnly });
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
