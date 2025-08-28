#thanks to 
https://github.com/Atharva3296
# Overview
This is a basic Node.js application that uses the Express framework to create a server for user registration and login functionality. It utilizes EJS (Embedded JavaScript) as the view engine for rendering HTML templates and bcrypt for password hashing.

## Prerequisites
Before running the code, ensure that you have the following installed:
- Node.js
- MongoDB (or any other database with appropriate configurations)
- The following npm packages:
  - express
  - bcrypt
  - ejs
  - path

Install required packages by running:
```bash
npm install express bcrypt ejs path
```

## File Structure
```
├── src
│   └── database.js   # Handles database connections (not provided in this code)
├── public            # Contains static files (e.g., CSS, JavaScript, images)
├── views             # Contains EJS view templates
│   ├── login.ejs
│   ├── signup.ejs
│   └── home.ejs
└── server.js         # Main server script
```

## Code Explanation

```javascript
const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./src/database");
```

### 1. Importing Modules
- `express`: The Express module provides a robust set of features for web and mobile applications. In this case, it is used to create a server.
- `path`: A Node.js built-in module that handles and transforms file paths.
- `bcrypt`: A library for hashing passwords. It uses salt rounds to increase the difficulty of brute-forcing passwords.
- `collection`: This imports the database connection and model from the `./src/database.js` file, assumed to be a MongoDB collection.

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

### 2. Middleware
- `express.json()`: Parses incoming requests with JSON payloads.
- `express.urlencoded({ extended: true })`: Parses URL-encoded data, typically from HTML form submissions.

```javascript
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
```

### 3. View Engine Setup
- `app.set("view engine", "ejs")`: Specifies EJS as the template engine to render HTML files with embedded JavaScript.
- `app.set("views", path.join(__dirname, "views"))`: Tells Express where to find the `views` directory (which contains EJS files).

```javascript
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
```

### 4. Serving Static Files
- `express.static("public")`: Serves static files (like CSS, JavaScript, or images) from the `public` directory.

```javascript
const port = 8080; // Port number for the server
```

### 5. Server Configuration
- `const port = 8080;`: Sets the port for the server to listen on (port 8080).

```javascript
app.get("/", (req, res) => {
  res.render("login.ejs");
});
```

### 6. Routes
- `app.get("/")`: This route handles the root URL (`/`). It renders the `login.ejs` file when accessed.

```javascript
app.get("/signup", async (req, res) => {
  res.render("signup.ejs");
});
```

- `app.get("/signup")`: Renders the signup page when the user visits the `/signup` URL.

```javascript
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };
```

### 7. User Registration (POST request to `/signup`)
- Retrieves user data (username and password) from the request body, typically from an HTML form.

```javascript
const existingUser = await collection.findOne({ name: data.name });
if (existingUser) {
  return res.send("User already exists. Please choose another username.");
}
```

- Checks if a user with the same username already exists in the database. If the user exists, it returns an error message.

```javascript
const saltRounds = 10;
const hashPass = await bcrypt.hash(data.password, saltRounds);
data.password = hashPass;
```

- Password hashing: Uses bcrypt to hash the password with 10 salt rounds (the higher the rounds, the more secure but slower it becomes).
  
```javascript
await collection.create(data);
res.send("User registered successfully.");
```

- Saves the hashed password and username to the database.

```javascript
app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
```

### 8. User Login (POST request to `/login`)
- Retrieves the username and password from the login form.

```javascript
const user = await collection.findOne({ name: username });
if (!user) {
  return res.send("User not found.");
}
```

- Checks if the username exists in the database.

```javascript
const isPassMatch = await bcrypt.compare(password, user.password);
if (isPassMatch) {
  res.render("home.ejs");
} else {
  res.send("Wrong password.");
}
```

- Uses bcrypt’s `compare` function to verify the password entered by the user matches the hashed password stored in the database.
- If the password matches, the user is logged in and redirected to the `home.ejs` page.

```javascript
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
```

### 9. Starting the Server
- The server listens for incoming requests on the specified port (`8080` in this case).
- A message is logged to the console when the server is up and running.

### Summary

- **Express** is used to handle routes and middleware.
- **bcrypt** is employed for hashing passwords to securely store them in the database.
- **EJS** is used as the view engine for rendering templates (login, signup, and home pages).
- **MongoDB** (or any other database) is assumed to handle data persistence for user accounts.
