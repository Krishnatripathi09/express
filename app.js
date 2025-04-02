const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/admin");
const { connectDB } = require("./config/database");
const { User } = require("./models/userSchema");
const { validateSignUpData } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

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

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).send("User Not Found Please Enter Valid Email 😕  ");
  }

  const isValidPassword = await user.verifyPWD(password);
  if (isValidPassword) {
    const token = await user.signJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });
    res.status(200).send("Sign In SuccessFull");
  } else {
    res.status(400).send("Invalid Password");
  }
});

app.get("/get", userAuth, async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;

  const decodedMsg = await jwt.verify(token, "MySecretKey");
  const { id } = decodedMsg;
  const page = req.query.page;
  let limit = req.query.limit;
  limit = limit > 2 ? 2 : 1;
  const skip = (page - 1) * limit;

  const user = await User.findById({ _id: id }).skip(skip).limit(limit);

  res.send("Found User ==> " + user);
});
