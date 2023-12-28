// utils/assign.utils.js

export const validateAssign = (req) => {
  const { areaId, driverId, vehicleId } = req.body;

  if (!areaId || !driverId || !vehicleId) {
    return "All fields are required";
  }

  if (
    areaId.length !== 24 ||
    driverId.length !== 24 ||
    vehicleId.length !== 24
  ) {
    return "Invalid ID";
  }

  return null;
};
