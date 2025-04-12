const Book = require("../models/Book");
const Rental = require("../models/Rental");

/**
 * Rent a book
 * - Book must exist and not be rented already.
 * - A user can rent only one book at a time.
 */
exports.rentBook = async (req, res) => {
  try {
    // Use user id from token if available (added by auth middleware)
    const userId = req.body.userId || req.user.id;
    const bookId = req.params.bookId;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    // Check if book is already rented
    if (book.isRented) {
      return res.status(400).json({ message: "Book is already rented" });
    }

    // Check if user already has an active rental
    const activeRental = await Rental.findOne({ user: userId, returnedAt: { $exists: false } });
    if (activeRental) {
      return res.status(400).json({ message: "User already has an active rental" });
    }

    // Mark book as rented
    book.isRented = true;
    await book.save();

    const newRental = new Rental({
      book: book._id,
      user: userId,
      rentedAt: new Date()
    });
    await newRental.save();

    res.status(201).json({ message: "Book rented successfully", rental: newRental });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Return a rented book.
 * - Only allow return if rental exists and is not already returned.
 */
exports.returnBook = async (req, res) => {
  try {
    const userId = req.body.userId || req.user.id;
    const bookId = req.params.bookId;

    // Find the active rental for this user and book
    const rental = await Rental.findOne({ book: bookId, user: userId, returnedAt: { $exists: false } });
    if (!rental) {
      return res.status(400).json({ message: "No active rental found for this user and book" });
    }

    // Mark rental as returned
    rental.returnedAt = new Date();
    await rental.save();

    // Update book status to available
    const book = await Book.findById(bookId);
    if (book) {
      book.isRented = false;
      await book.save();
    }

    res.status(200).json({ message: "Book returned successfully", rental });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
