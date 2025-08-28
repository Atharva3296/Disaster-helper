const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./src/database");       

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS as the view engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

const port = 8080; // Port number for the server

// Render the login page when accessing the root URL
app.get("/", (req, res) => {
  res.render("login.ejs");
});

// Render the signup page when accessing the "/signup" URL
app.get("/signup", async (req, res) => {
  res.render("signup.ejs");
});

// Handle user registration
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username, // Get username from the request body
    password: req.body.password, // Get password from the request body
  };

  try {
    // Check if a user with the same username already exists
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
      return res.send("User already exists. Please choose another username.");
    }

    // Hash the password using bcrypt with 10 salt rounds
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPass; // Replace plain text password with hashed password

    // Save the new user data to the database
    await collection.create(data);
    res.send("User registered successfully.");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Server error.");
  }
});

// Handle user login
app.post("/login", async (req, res) => {
  try {
    const username = req.body.username; // Get username from the request body
    const password = req.body.password; // Get password from the request body

    // Retrieve the user from the database
    const user = await collection.findOne({ name: username });
    if (!user) {
      return res.send("User not found.");
    }

    // Compare the provided password with the hashed password in the database
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (isPassMatch) {
      res.render("home.ejs"); // Render home page if passwords match
    } else {
      res.send("Wrong password."); // Send error message if passwords don't match
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error.");
  }
});


//news section
app.get("/news",  (req, res) => {
  res.render("news.ejs");
});

//volunteer section route
app.get("/volunteer", async (req, res) => {
  res.render("volunteer.ejs");
});


////thankyou section route
app.get("/thankyou", async (req, res) =>{
  res.render("thankyou.ejs");
})

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
