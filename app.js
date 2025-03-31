const express = require("express");
const { adminAuth } = require("./middlewares/admin");
const { connectDB } = require("./config/database");
const { User } = require("./models/userSchema");
const { validateSignUpData } = require("./utils/validation");
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
  validateSignUpData(req, res);
  const { firstName, lastName, gender, email, password } = req.body;

  try {
    const user = await User({
      firstName,
      lastName,
      gender,
      email,
      password,
    });
    await user.save();

    res.send("User Data Saved SuccessFully" + user);
  } catch (err) {
    console.log(err);
  }
});

app.get("/get", async (req, res) => {
  const id = req.body.id;
  const user = await User.findById(id);

  res.send("Found User ==> " + user);
});
