const express = require("express");
const { adminAuth } = require("./middlewares/admin");
const { connectDB } = require("./config/database");
const { User } = require("./models/userSchema");
const { validateSignUpData } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await User({
      firstName,
      lastName,
      gender,
      email,
      password: passwordHash,
    });
    await user.save();

    res.send("User Data Saved SuccessFully" + user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).send("User Not Found Please Enter Valid Email 😕  ");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  const id = user.id;
  if (isValidPassword) {
    const token = await jwt.sign({ id: id }, "MySecretKey");
    res.cookie("token", token);
    res.status(200).send("Sign In SuccessFull");
  } else {
    res.status(400).send("Invalid Password");
  }
});

app.get("/get", async (req, res) => {
  const id = req.body.id;
  const user = await User.findById(id);

  res.send("Found User ==> " + user);
});
