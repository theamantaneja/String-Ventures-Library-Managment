// frontend/src/App.js
import React, { useContext } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';

// Import pages
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import BorrowReturn from './pages/BorrowReturn';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyBorrows from './pages/MyBorrows';

// Import the new CSS file
import './App.css';

function App() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <NavLink to="/" className="brand">
          LibraryApp
        </NavLink>

        <div className="nav-links">
          {user ? (
            <>
              <NavLink to="/" end>
                Dashboard
              </NavLink>
              {' | '}
              <NavLink to="/books">All Books</NavLink>
              {!user.isAdmin && (
                <>
                  {' | '}
                  <NavLink to="/borrow-return">Borrow & Return</NavLink>
                  {' | '}
                  <NavLink to="/my-borrows">My Borrows</NavLink>
                </>
              )}
              {user.isAdmin && (
                <>
                  {' | '}
                  <NavLink to="/add-book">Add Book</NavLink>
                </>
              )}
              {' | '}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/books" element={user ? <BookList /> : <Navigate to="/login" />} />
          <Route
            path="/borrow-return"
            element={user && !user.isAdmin ? <BorrowReturn /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-borrows"
            element={user && !user.isAdmin ? <MyBorrows /> : <Navigate to="/login" />}
          />
          <Route path="/add-book" element={user?.isAdmin ? <AddBook /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
