// frontend/src/pages/BorrowReturn.js
import React, { useState } from 'react';
import API from '../services/api';

// Import the CSS file
import './css/BorrowReturn.css';

function BorrowReturn() {
  const [borrowBookId, setBorrowBookId] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Feedback messages
  const [borrowMessage, setBorrowMessage] = useState('');
  const [returnMessage, setReturnMessage] = useState('');

  // Handle borrowing a book
  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      const resp = await API.post('/transactions/borrow', { bookID: borrowBookId });
      setBorrowMessage(resp.data.message);
      setBorrowBookId(''); // clear input
    } catch (error) {
      setBorrowMessage(error.response?.data?.error || 'Error borrowing book');
    }
  };

  // Handle returning a book
  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const resp = await API.post('/transactions/return', { transactionID: transactionId });
      setReturnMessage(resp.data.message);
      setTransactionId(''); // clear input
    } catch (error) {
      setReturnMessage(error.response?.data?.error || 'Error returning book');
    }
  };

  return (
    <div className="borrow-return-container">
      {/* Borrow Section */}
      <div className="borrow-section">
        <h2>Borrow a Book</h2>
        <form onSubmit={handleBorrow} className="borrow-form">
          <label htmlFor="bookId">Book ID:</label>
          <input
            id="bookId"
            type="text"
            value={borrowBookId}
            onChange={(e) => setBorrowBookId(e.target.value)}
          />
          <button type="submit">Borrow</button>
        </form>
        {borrowMessage && <p className="message">{borrowMessage}</p>}
      </div>

      {/* Return Section */}
      <div className="return-section">
        <h2>Return a Book</h2>
        <form onSubmit={handleReturn} className="return-form">
          <label htmlFor="transactionId">Transaction ID:</label>
          <input
            id="transactionId"
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <button type="submit">Return</button>
        </form>
        {returnMessage && <p className="message">{returnMessage}</p>}
      </div>
    </div>
  );
}

export default BorrowReturn;
