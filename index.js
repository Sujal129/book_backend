import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 4000;
// const URI =
//   "mongodb+srv://sujalgupta9211:sujalgupta9211@cluster0.m7mn6yv.mongodb.net/test";
  const URI = "mongodb+srv://sujalgupta9211:sujalgupta9211@cluster0.m7mn6yv.mongodb.net/test?retryWrites=true&w=majority";

// connect to mongoDB
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// defining routes
app.use("/book", bookRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
