const adminAuth = (req, res, next) => {
  const role = req.body.role;
  if (role === "admin") {
    console.log("Admin Authorized");
  } else {
    conseol.log("Not Authorized");
  }

  next();
};

module.exports = {
  adminAuth,
};
