const express = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

let books = [];

app.get('/', (req, res) => {
    res.send("Welcome to Library Management System API");
});

app.post('/api/books', (req, res) => {

    const { id, title, author, category, quantity, available } = req.body;

    if (
        id === undefined ||
        title === undefined ||
        author === undefined ||
        category === undefined ||
        quantity === undefined
    ) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Book ID must be a positive integer"
        });
    }

    if (
        typeof title !== 'string' || title.trim() === '' ||
        typeof author !== 'string' || author.trim() === '' ||
        typeof category !== 'string' || category.trim() === ''
    ) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
            message: "Quantity must be a positive integer"
        });
    }

    const availableBooks = available === undefined ? quantity : available;

    if (
        !Number.isInteger(availableBooks) ||
        availableBooks < 0 ||
        availableBooks > quantity
    ) {
        return res.status(400).json({
            message: "Invalid available quantity"
        });
    }

    const existingBook = books.find(book => book.id === id);

    if (existingBook) {
        return res.status(409).json({
            message: "Book ID already exists"
        });
    }

    const newBook = {
        id,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        quantity,
        available: availableBooks
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });

});

app.get('/api/books', (req, res) => {

    if (books.length === 0) {
        return res.status(200).json({
            message: "No books available",
            books: []
        });
    }

    res.status(200).json({
        message: "Books retrieved successfully",
        books: books
    });

});

app.get('/api/books/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json({
        message: "Book retrieved successfully",
        book: book
    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

