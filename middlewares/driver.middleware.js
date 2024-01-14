const driverMiddleware = (req, res, next) => {
  // Add authentication logic here if needed
  console.log("Driver Middleware");
  next();
}

export default driverMiddleware;