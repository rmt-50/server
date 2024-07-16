const express = require("express");
const { User } = require("./models");

const app = express();

app.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (err) {
    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).json({
        message: err.errors[0].message,
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});