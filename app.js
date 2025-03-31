const express = require("express");
const { adminAuth } = require("./middlewares/admin");
const { connectDB } = require("./config/database");
const { User } = require("./models/userSchema");
const app = express();
app.use(express.json());

const PORT = 3000;

connectDB()
  .then(() => {
    console.log("connection to DataBase SuccessFull");

    app.listen(PORT, () => {
      console.log(`Server is Listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/user", async (req, res) => {
  try {
    const userData = {
      firstName: "Krishna",
      lastName: "Tripathi",
      email: "krishna@gmail.com",
      password: "krishna123",
    };

    const user = await User(userData);
    await user.save();

    res.send("User Data Saved SuccessFully" + user);
  } catch (err) {
    console.log(err);
  }
});
