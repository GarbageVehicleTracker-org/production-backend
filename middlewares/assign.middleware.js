const assignMiddleware = function (req, res, next) {
  //   const { areaId, userId, assignId } = req.body;
  //   if (!areaId || !userId || !assignId) {
  //     return res.status(400).json({
  //       error: "Missing required fields",
  //     });
  //   }
  console.log("Assign Middleware");
  next();
};

export default assignMiddleware;
