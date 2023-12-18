const vehicleMiddleware = (req, res, next) => {
  // Add authentication logic here if needed
  console.log("Vehicle Middleware");
  next();
};

export default vehicleMiddleware;
