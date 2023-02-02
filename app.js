const { hashPassword, verifyPassword, verifyToken } = require("./auth");
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const express = require("express");

require("dotenv").config();

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5005;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/users", hashPassword, userHandlers.postUser);
app.get("/api/users/:id", userHandlers.getUserById);
app.get("/api/users", userHandlers.getUsers);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken);

app.delete("/api/movies/:id", verifyToken, movieHandlers.deleteMovie);
app.put("/api/users/:id", userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }

  const isItDwight = (req, res) => {
    if (
      req.body.email === "dwight@theoffice.com" &&
      req.body.password === "123456"
    ) {
      res.send("Credentials are valid");
    } else {
      res.sendStatus(401);
    }
  };

  app.post("/api/login", isItDwight);
});
