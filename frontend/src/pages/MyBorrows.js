// frontend/src/pages/MyBorrows.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';

// Import the CSS file
import './css/MyBorrows.css';

function MyBorrows() {
  const [transactions, setTransactions] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // 1. Fetch the user's borrowed books
  const fetchMyTransactions = async () => {
    setLoading(true);
    try {
      const resp = await API.get('/transactions/mine');
      // Ensure resp.data is an array
      const data = Array.isArray(resp.data) ? resp.data : [];
      // Filter out returned transactions
      const activeTransactions = data.filter(tx => !tx.returnDate);
      setTransactions(activeTransactions);
      setMsg({ type: '', text: '' }); // Clear any previous messages
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.error || 'Error fetching borrowed books' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle returning a book
  const handleReturnBook = async (transactionID) => {
    if (!window.confirm('Are you sure you want to return this book?')) {
      return;
    }

    try {
      const resp = await API.post('/transactions/return', { transactionID });
      setMsg({ type: 'success', text: resp.data.message });
      // Remove the returned transaction from the list
      setTransactions(prevTransactions => prevTransactions.filter(tx => tx._id !== transactionID));
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.error || 'Error returning the book' });
    }
  };

  // 3. On component mount, fetch transactions
  useEffect(() => {
    fetchMyTransactions();
  }, []);

  return (
    <div className="my-borrows-container">
      <h2>My Borrowed Books</h2>

      {/* Display any success/error messages */}
      {msg.text && <div className={`my-borrows-message ${msg.type}`}>{msg.text}</div>}

      {/* Loading Indicator */}
      {loading ? (
        <p className="my-borrows-loading">Loading your borrowed books...</p>
      ) : (
        <>
          {/* If there are no borrowed books, show a placeholder message */}
          {transactions.length === 0 ? (
            <p className="my-borrows-empty">You have no borrowed books.</p>
          ) : (
            <table className="my-borrows-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Title</th>
                  <th>Borrowed On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const returned = !!tx.returnDate; // True if 'returnDate' exists
                  return (
                    <tr key={tx._id}>
                      <td className="transaction-id">{tx._id}</td>
                      <td className="book-title" title={tx.bookID?.title || 'No Title'}>
                        {tx.bookID?.title || 'N/A'}
                      </td>
                      <td>{tx.borrowDate ? new Date(tx.borrowDate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button
                          className="return-button"
                          onClick={() => handleReturnBook(tx._id)}
                          disabled={returned}
                        >
                          {returned ? 'Returned' : 'Return'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default MyBorrows;
