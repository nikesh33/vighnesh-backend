const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rentedAt: { type: Date, default: Date.now },
  returnedAt: { type: Date },
});

module.exports = mongoose.model("Rental", RentalSchema);
