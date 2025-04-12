const express = require("express");
const { rentBook, returnBook } = require("../controllers/rentalController");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/rent/:bookId", authenticateJWT, rentBook);
router.post("/return/:bookId", authenticateJWT, returnBook);

module.exports = router;
