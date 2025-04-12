const express = require("express");
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} = require("../controllers/bookController");
const { authenticateJWT } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);

router.post("/", authenticateJWT, upload.single("coverImage"), createBook);
router.put("/:id", authenticateJWT, upload.single("coverImage"), updateBook);
router.delete("/:id", authenticateJWT, deleteBook);

module.exports = router;
