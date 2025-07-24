import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  id: Number,
  category: String,
  title: String,
  author: String,
  genre: String,
  publishedYear: Number,
  price: String,
  image: String,
  url: String
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
