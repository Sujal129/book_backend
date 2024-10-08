import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import User from "./model/user.model.js"; // Assuming User model is located in models/User.js

const app = express();

// app.use(cors());

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//    credentials: true
// }));

var whitelist = ['https://book-store-rho-beryl.vercel.app/', 'https://book-store-rho-beryl.vercel.app']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true,
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  exposedHeaders: ['Content-Range', 'X-Content-Range'], // Exposed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  maxAge: 86400, // Max age in seconds (1 day)
  preflightContinue: false, // Pass the CORS preflight response to the next handler
  optionsSuccessStatus: 204 // Use 204 status code for successful OPTIONS requests
  } 
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;
// const URI =
//   "mongodb+srv://sujalgupta9211:sujal9211@cluster0.ynkag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// defining routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
mongoose.set("debug", true);
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// user/signup route

app.post("/user/signup", async (req, res) => {
  try {
    const {fullname, email, password } = req.body;

    // Validate input
    if (!fullname ||!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Already exist account" });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return success response with the token
    res.status(200).json({ message: "signup successful", user, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// login route
app.post("/user/login",cors(corsOptionsDelegate), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return success response with the token
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/users",cors(corsOptionsDelegate), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
  // connect to mongoDB
  //   1st
  // connect to mongoDB
  try {
    mongoose.connect(URI);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log("Error: ", error);
  }
  const users = await User.find();
  console.log(users);
});
