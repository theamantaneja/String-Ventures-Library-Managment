// backend/seeder.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Book = require('./models/Book');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error('DB Connection Error:', error);
    process.exit(1);
  }
}

async function seedData() {
  try {
    // Clear existing data (optional)
    await User.deleteMany({});
    await Book.deleteMany({});

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      contactInfo: 'admin@library.com',
      email: 'admin@library.com',
      password: adminPassword,
      isAdmin: true,
    });

    // Create Regular User
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await User.create({
      name: 'Normal User',
      contactInfo: 'user@library.com',
      email: 'user@library.com',
      password: userPassword,
      isAdmin: false,
    });

    // Create some Books
    const booksData = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 },
      { title: '1984', author: 'George Orwell', publicationYear: 1949 },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', publicationYear: 1960 },
      { title: 'Pride and Prejudice', author: 'Jane Austen', publicationYear: 1813 },
      { title: 'The Catcher in the Rye', author: 'J.D. Salinger', publicationYear: 1951 },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', publicationYear: 1937 },
      { title: 'Fahrenheit 451', author: 'Ray Bradbury', publicationYear: 1953 },
      { title: 'Moby-Dick', author: 'Herman Melville', publicationYear: 1851 },
      { title: 'War and Peace', author: 'Leo Tolstoy', publicationYear: 1869 },
      { title: 'The Odyssey', author: 'Homer', publicationYear: -800 }, // Approximate year
      { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', publicationYear: 1866 },
      { title: 'Brave New World', author: 'Aldous Huxley', publicationYear: 1932 },
      { title: 'Jane Eyre', author: 'Charlotte Brontë', publicationYear: 1847 },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', publicationYear: 1954 },
      { title: 'Animal Farm', author: 'George Orwell', publicationYear: 1945 },
      // Add more books as needed
    ];

    const createdBooks = await Book.insertMany(booksData);

    console.log('--- Seeding Completed ---');
    console.log('Admin:', adminUser);
    console.log('Regular User:', regularUser);
    console.log('Books:', createdBooks);
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

connectDB().then(() => {
  seedData();
});
