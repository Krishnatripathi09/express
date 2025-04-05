const express = require("express");
const validator = require("validator");
const { validateEditProfileData } = require("../utils/validation");
const { userAuth } = require("../middlewares/admin");
const profileRouter = express.Router();
const User = require("../models/userSchema");
profileRouter.get("/get", userAuth, async (req, res) => {
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

profileRouter.patch("/user/edit", userAuth, async (req, res) => {
  if (!validateEditProfileData(req)) {
    res.status(403).send("Edit Not Allowed On This Field");
  }

  const loggedInUser = req.user;

  Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

  await loggedInUser.save();
});

profileRouter.patch("/user/password", userAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const loggedInUser = req.user;

  if (!oldPassword || !newPassword) {
    res.status(400).send("Both Old and New Passwords Are Required");
  } else if (!validator.isStrongPassword(newPassword)) {
    res.status(400).send("Please Enter Strong New Password");
  }

  const validPassword = await bcrypt.compare(
    oldPassword,
    loggedInUser.password
  );
  if (!validPassword) {
    res.status(403).send("Please Enter Valid Old Password");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  loggedInUser.password = passwordHash;
  await loggedInUser.save();
});

profileRouter.post("/logout", (req, res) => {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logged-out SuccessFully");
});

module.exports = {
  profileRouter,
};
