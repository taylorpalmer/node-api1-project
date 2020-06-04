const express = require("express");
const db = require("./database");

const server = express();

server.use(express.json());

server.get("/users", (req, res) => {
  const users = db.getUsers();
  res.json(users);
});

server.get("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  if (user) {
    res.json(user);
  } else if (!user) {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  } else {
    res.status(500).json({
      message: "The user information could not be retrieved.",
    });
  }
});

server.post("/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    return res.status(400).json({
      message: "Please provide name and bio for the user.",
    });
  } else if (req.body.name || req.body.bio) {
    const newUser = db.createUser({
      name: req.body.name,
      bio: req.body.bio,
    });

    res.status(201).json(newUser);
  } else {
    res.status(500).json({
      message: "There was an error while saving the user to the database.",
    });
  }
});

server.put("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  if (user) {
    const updateUser = db.updateUser(user.id, {
      name: req.body.name || user.name,
    });

    res.status(200).json(updateUser);
  } else if (!user) {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  } else if (!req.body.name || !req.body.bio) {
    res.status(400).json({
      message: "Please provide name and bio for the user.",
    });
  } else {
    res.status(500).json({
      message: "The user information could not be modified.",
    });
  }
});

server.delete("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  if (user) {
    db.deleteUser(user.id);

    res.status(204).end();
  } else if (!user) {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  } else {
    res.status(500).json({
      message: "The user could not be removed.",
    });
  }
});
