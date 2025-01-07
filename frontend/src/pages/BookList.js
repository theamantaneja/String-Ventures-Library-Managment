// frontend/src/pages/BookList.js
import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { UserContext } from '../context/UserContext';

// Import the CSS file
import './css/BookList.css';

/**
 * Sub-component that renders a table of books.
 * If the user is an admin, shows a Delete button for each row.
 */
function BookTable({ books, isAdmin, onDelete }) {
  return (
    <table className="book-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Author</th>
          <th>Year</th>
          <th>Status</th>
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={book._id}>
            <td>{index + 1}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.publicationYear}</td>
            <td>{book.availabilityStatus ? 'Available' : 'Not Available'}</td>
            {isAdmin && (
              <td>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(book._id)}
                >
                  Delete Book
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BookList() {
  const [books, setBooks] = useState([]);
  const [msg, setMsg] = useState('');
  const { user } = useContext(UserContext);

  const fetchBooks = async () => {
    try {
      const response = await API.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    try {
      const resp = await API.delete(`/books/${bookId}`);
      setMsg(resp.data.message);
      // re-fetch books
      fetchBooks();
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error deleting book');
    }
  };

  const isAdmin = user?.isAdmin;

  return (
    <div className="book-list-container">
      <h2>All Books</h2>

      {msg && <p className="message">{msg}</p>}

      <BookTable
        books={books}
        isAdmin={isAdmin}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default BookList;
