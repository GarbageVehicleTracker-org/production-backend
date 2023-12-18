// areas.controllers.js
import Area from "../models/Areas.models.js";
import Dustbin from "../models/Dustbins.models.js";
class AreaController {
  async createArea(req, res) {
    try {
      const { areaId, name } = req.body;

      // Assuming the dustbins field is an array of ObjectId
      const dustbins = []; // You need to properly populate this array with ObjectId values

      const area = new Area({ areaId, name, dustbins });
      const savedArea = await area.save();

      res.status(201).json(savedArea);
    } catch (error) {
      // Handle errors
      console.error("Error creating area:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllAreas(req, res) {
    try {
      const areas = await Area.find();
      res.status(200).json(areas);
    } catch (error) {
      console.error("Error getting areas:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAreaDetails(req, res) {
    const { areaId } = req.params;

    try {
      // Find the area with the specified areaId
      const area = await Area.findOne({ areaId });

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      // Populate the 'dustbins' field to get details of all associated dustbins
      const populatedArea = await Area.findOne({ areaId })
        .populate({
          path: "dustbins",
          model: Dustbin,
          select: "-__v", 
        })
        .lean();

      res.status(200).json(populatedArea);
    } catch (error) {
      console.error("Error getting area details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateAreaDetails(req, res) {
    const { areaId } = req.params;
    const { name } = req.body;

    try {
      const area = await Area.findOne({ areaId });

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      area.name = name;
      const updatedArea = await area.save();

      res.status(200).json(updatedArea);
    } catch (error) {
      console.error("Error updating area details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
export default new AreaController();
