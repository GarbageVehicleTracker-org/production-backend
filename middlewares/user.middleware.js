//user.middleware.js

const validateUser = (req) => {
  if (req.body.email && req.body.password) {
    return true;
  }
  return false;
};

const userMiddleware = (req, res, next) => {
  if (validateUser(req)) {
    next();
  } else {
    res.status(400).send("User data is not valid");
  }
};
export default userMiddleware;