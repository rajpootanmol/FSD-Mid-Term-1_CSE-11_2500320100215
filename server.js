const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Technology",
        quantity: 5,
        available: 4
    },
    {
        id: 2,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, David Thomas",
        category: "Technology",
        quantity: 3,
        available: 3
    },
    {
        id: 3,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Fiction",
        quantity: 4,
        available: 2
    }
];

let nextId = 4;

function isValidId(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
}

function findBook(id) {
    return books.find(book => book.id === Number(id));
}

app.get('/', (req, res) => {
    res.status(200).send("Welcome to Library Management System API");
});

app.post('/api/books', (req, res) => {

    const { id, title, author, category, quantity, available } = req.body;

    if (
        title === undefined ||
        author === undefined ||
        category === undefined ||
        quantity === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Title, author, category and quantity are required"
        });
    }

    if (id !== undefined && !isValidId(id)) {
        return res.status(400).json({
            success: false,
            message: "Book ID must be a positive integer"
        });
    }

    const bookId = id === undefined ? nextId : Number(id);

    if (findBook(bookId)) {
        return res.status(409).json({
            success: false,
            message: "Book with this ID already exists"
        });
    }

    if (
        typeof title !== 'string' || title.trim() === '' ||
        typeof author !== 'string' || author.trim() === '' ||
        typeof category !== 'string' || category.trim() === ''
    ) {
        return res.status(400).json({
            success: false,
            message: "Title, author and category must be valid strings"
        });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
            success: false,
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
            success: false,
            message: "Available copies must be between 0 and quantity"
        });
    }

    const newBook = {
        id: bookId,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        quantity: quantity,
        available: availableBooks
    };

    books.push(newBook);

    if (bookId >= nextId) {
        nextId = bookId + 1;
    }

    res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: newBook
    });

});


app.get('/api/books', (req, res) => {

    const { search, category, author } = req.query;

    let results = [...books];

    if (search) {
        const term = search.toLowerCase();

        results = results.filter(book =>
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term) ||
            book.category.toLowerCase().includes(term)
        );
    }

    if (category) {
        results = results.filter(book =>
            book.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (author) {
        results = results.filter(book =>
            book.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    res.status(200).json({
        success: true,
        count: results.length,
        data: results
    });

});

app.get('/api/books/:id', (req, res) => {

    const id = req.params.id;

    if (!isValidId(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const book = findBook(id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    res.status(200).json({
        success: true,
        data: book
    });

});

app.put('/api/books/:id', (req, res) => {

    const id = req.params.id;

    if (!isValidId(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const book = findBook(id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const { title, author, category, quantity, available } = req.body;

    if (
        (title !== undefined && (typeof title !== 'string' || title.trim() === '')) ||
        (author !== undefined && (typeof author !== 'string' || author.trim() === '')) ||
        (category !== undefined && (typeof category !== 'string' || category.trim() === ''))
    ) {
        return res.status(400).json({
            success: false,
            message: "Title, author and category must be valid strings"
        });
    }

    const newQuantity = quantity === undefined ? book.quantity : quantity;
    const newAvailable = available === undefined ? book.available : available;

    if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a positive integer"
        });
    }

    if (
        !Number.isInteger(newAvailable) ||
        newAvailable < 0 ||
        newAvailable > newQuantity
    ) {
        return res.status(400).json({
            success: false,
            message: "Available copies must be between 0 and quantity"
        });
    }

    if (title !== undefined) book.title = title.trim();
    if (author !== undefined) book.author = author.trim();
    if (category !== undefined) book.category = category.trim();

    book.quantity = newQuantity;
    book.available = newAvailable;

    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book
    });

});

app.delete('/api/books/:id', (req, res) => {

    const id = req.params.id;

    if (!isValidId(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const index = books.findIndex(book => book.id === Number(id));

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1)[0];

    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook
    });

});

app.post('/api/books/:id/issue', (req, res) => {

    const id = req.params.id;

    if (!isValidId(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const book = findBook(id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    if (book.available <= 0) {
        return res.status(400).json({
            success: false,
            message: "No copies currently available to issue"
        });
    }

    book.available--;

    res.status(200).json({
        success: true,
        message: "Book issued successfully",
        data: book
    });

});

app.post('/api/books/:id/return', (req, res) => {

    const id = req.params.id;

    if (!isValidId(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const book = findBook(id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    if (book.available >= book.quantity) {
        return res.status(400).json({
            success: false,
            message: "All copies are already available"
        });
    }

    book.available++;

    res.status(200).json({
        success: true,
        message: "Book returned successfully",
        data: book
    });

});

app.listen(PORT, () => {
    console.log(`Library Management Server is running on http://localhost:${PORT}`);
});

