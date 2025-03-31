const validator = require("validator");

const validateSignUpData = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).send("Please Enter First and Last Name");
  } else if (firstName.length < 4 || firstName.length > 50) {
    return res
      .status(400)
      .send("First Name Should be between 4 and 50 Characters");
  } else if (lastName.length < 4 || lastName.length > 30) {
    return res
      .status(400)
      .send("Last Name Should be betweeen 4 and 30 Characters");
  } else if (!validator.isEmail(email)) {
    return res.status(400).send("Please Enter Valid Email");
  } else if (!validator.isStrongPassword(password)) {
    return res.status(400).send("Please Enter Strong Password");
  }
};

module.exports = {
  validateSignUpData,
};
