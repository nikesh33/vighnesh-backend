const Book = require("../models/Book");

exports.createBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    // If a file was uploaded, set the cover image path
    const coverImage = req.file ? req.file.path : undefined;

    const newBook = new Book({
      title,
      author,
      description,
      coverImage,
      isRented: false
    });

    await newBook.save();
    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }

    const books = await Book.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const count = await Book.countDocuments(query);

    res.status(200).json({
      books,
      totalPages: Math.ceil(count / +limit),
      currentPage: +page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    // If a new file is uploaded, update the cover image
    const coverImage = req.file ? req.file.path : undefined;

    const updateData = { title, author, description };
    if (coverImage) updateData.coverImage = coverImage;

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook)
      return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
