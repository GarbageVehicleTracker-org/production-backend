import Area from "../models/Areas.models.js";
import Dustbin from "../models/Dustbins.models.js";

class DustbinController {
  
  async createDustbin(req, res) {
    const { areaId, coordinates } = req.body;

    try {
      const uniqueSuffix = Date.now().toString(); // Unique timestamp for continuous characters
      const modifiedAreaId = `${areaId}_${uniqueSuffix}`;

      const area = await Area.findOne({ areaId });

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      const dustbin = new Dustbin({
        areaId: modifiedAreaId, // Use the modified areaId
        coordinates,
        isVisited: false,
        visitedTimestamp: null,
      });

      const savedDustbin = await dustbin.save();
      if (savedDustbin) {
        console.log("Dustbin created successfully");
      }

      // Update the corresponding Area's dustbins array with the new dustbin's ObjectId
      area.dustbins.push(savedDustbin._id);
      area.dustbinsCount = area.dustbins.length;

      // Save the updated Area document
      await area.save();

      res.status(200).json(savedDustbin);
    } catch (error) {
      console.error("Error adding dustbin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllDustbins(req, res) {
    const { areaId } = req.params;

    try {
      const dustbins = await Dustbin.find({
        areaId: { $regex: `^${areaId}` },
      });

      if (!dustbins || dustbins.length === 0) {
        return res.status(404).json({ error: "No matching dustbins found" });
      }

      res.status(200).json(dustbins);
    } catch (error) {
      console.error("Error getting all dustbins:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllDustbinsCoordinates(req, res) {
    const { areaId } = req.params;

    try {
      // Find all dustbins with the matching areaId prefix
      const dustbins = await Dustbin.find({
        areaId: { $regex: `^${areaId}` },
      });

      if (!dustbins || dustbins.length === 0) {
        return res.status(404).json({ error: "No matching dustbins found" });
      }

      // Extract middle coordinates from the area's dustbins
      const dustbinsWithMiddleCoordinates = dustbins.map((dustbin) => {
        const { coordinates } = dustbin;
        const middleIndex = Math.floor(coordinates.length / 2);
        const middleCoordinates = coordinates[middleIndex];

        return {
          dustbinId: dustbin._id,
          areaId: dustbin.areaId.split("_")[0],
          middleCoordinates,
        };
      });

      res.status(200).json(dustbinsWithMiddleCoordinates);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new DustbinController();
