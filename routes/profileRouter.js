const express = require("express");
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

module.exports = {
  profileRouter,
};
