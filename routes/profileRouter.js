const express = require("express");
const { validateEditProfileData } = require("../utils/validation");
const { userAuth } = require("../middlewares/admin");
const profileRouter = express.Router();

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

module.exports = {
  profileRouter,
};
