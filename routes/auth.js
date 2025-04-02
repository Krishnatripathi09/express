const express = require("express");
const authRouter = express.Router();

authRouter.post("/user", async (req, res) => {
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

authRouter.post("/signin", async (req, res) => {
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

module.exports = {
  authRouter,
};
