const areaMiddleware = (req, res, next) => {
  // Add authentication logic here if needed
  // console.log("Area Middleware");
  next();
};

export default areaMiddleware;
