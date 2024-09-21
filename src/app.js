const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  await user.save();
  res.send("User registered successfully");
});

// Get user by emailId
app.get("/user", async (req, res) => {
  const users = await User.find({ emailId: req.body.emailId });
  if (users.length === 0) {
    res.status(404).send("User not found");
  } else {
    res.send(users);
  }
});

app.get("/feed", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).send("No user ID provided");
  }
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const updatedUser = req.body;
  if (!userId) {
    return res.status(400).send("No user ID provided");
  }

  try {
    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      returnDocument: "after",
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ------------------------------------------------------------------

connectDB()
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(3333, () => {
      console.log(
        `Server started and listening on port : http://localhost:3333`
      );
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });
