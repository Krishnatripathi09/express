const { User } = require("../models/userSchema");

const userAuth = async (req, res) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      res.status(401).send("Pleae Log-In Again");
    }

    const user = await jwt.verify(token, "MySecretKey");

    const { id } = token;

    const foundUser = await User.findById(id);
    if (!foundUser) {
      res.status(404).send("User Not Found");
    }

    req.user = foundUser;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  userAuth,
};
