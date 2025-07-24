import express from "express";
import { getBook } from "../controller/book.controller.js";
import Book from "../model/book.model.js";

const router = express.Router();

router.get("/", getBook);
// POST /book/add  → Add a new book
router.post("/add", async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json({ message: "Book added successfully", data: savedBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(400).json({ message: "Failed to add book", error: error.message });
  }
});

// // GET /book/all  → Fetch all books
// router.get("/all", async (req, res) => {
//   try {
//     const books = await Book.find();
//     res.status(200).json({ message: "Books retrieved successfully", data: books });
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     res.status(500).json({ message: "Failed to fetch books", error: error.message });
//   }
// });
router.get("/all", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books); // ✅ Just return the array directly
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});


export default router;