// frontend/src/pages/Dashboard.js
import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import './css/Dashboard.css';

// Import UserContext
import { UserContext } from '../context/UserContext';

/* 
 * A small sub-component to show key stats in “cards.” 
 */
function StatsPanel({ stats }) {
  const { totalBooks, borrowedCount, availableCount } = stats;

  return (
    <div className="stats-panel">
      <div className="stats-card">
        <h4>Total Books</h4>
        <p>{totalBooks}</p>
      </div>

      <div className="stats-card">
        <h4>Borrowed Books</h4>
        <p>{borrowedCount}</p>
      </div>

      <div className="stats-card">
        <h4>Available Books</h4>
        <p>{availableCount}</p>
      </div>
    </div>
  );
}

/* 
 * Sub-component for the list (or table) of available books with Borrow functionality.
 */
function AvailableBooksTable({ books, onBorrow, isAdmin }) {
  return (
    <div className="available-books-section">
      <h3>List of Available Books</h3>
      <table className="books-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Book Title</th>
            <th>Book ID</th>
            {/* Conditionally render the Action column header */}
            {!isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {books.map((b, index) => (
            <tr key={b._id}>
              <td>{index + 1}</td>
              <td>{b.title}</td>
              <td>{b._id}</td>
              {/* Conditionally render the Action button */}
              {!isAdmin && (
                <td>
                  <button
                    className="borrow-button"
                    onClick={() => onBorrow(b._id)}
                  >
                    Borrow
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedCount: 0,
    availableCount: 0,
  });
  const [books, setBooks] = useState([]);

  // State for feedback messages
  const [message, setMessage] = useState({ type: '', text: '' });

  // Access user information from UserContext
  const { user } = useContext(UserContext);

  const fetchStats = async () => {
    try {
      const resp = await API.get('/books');
      const all = resp.data;
      const totalBooks = all.length;
      const borrowedCount = all.filter((b) => !b.availabilityStatus).length;
      const availableCount = totalBooks - borrowedCount;

      setStats({ totalBooks, borrowedCount, availableCount });

      // Store all books to easily filter or display them
      setBooks(all);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error fetching dashboard data.',
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Filter the available books
  const availableBooks = books.filter((b) => b.availabilityStatus);

  // Handler to borrow a book
  const handleBorrowBook = async (bookID) => {
    try {
      const resp = await API.post('/transactions/borrow', { bookID });
      setMessage({ type: 'success', text: resp.data.message });
      fetchStats(); // Refresh stats and books list
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error borrowing the book.',
      });
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Library Dashboard</h2>

      {/* Feedback Message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Key Stats Panel */}
      <StatsPanel stats={stats} />

      {/* Table for available books */}
      <AvailableBooksTable
        books={availableBooks}
        onBorrow={handleBorrowBook}
        isAdmin={user?.isAdmin} // Pass isAdmin prop
      />
    </div>
  );
}

export default Dashboard;
