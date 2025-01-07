// frontend/src/pages/AddBook.js
import React, { useState } from 'react';
import API from '../services/api';

// Import the CSS file
import './css/AddBook.css';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await API.post('/books', {
        title,
        author,
        publicationYear: year,
      });
      setMsg(`Book added: ${resp.data.title}`);
      setTitle('');
      setAuthor('');
      setYear('');
    } catch (error) {
      setMsg(error.response?.data?.error || 'Error adding book');
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add a New Book (Admin Only)</h2>

      {msg && <p className="add-book-message">{msg}</p>}

      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Publication Year</label>
          <input
            id="year"
            type="number"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <button type="submit" className="add-book-button">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
