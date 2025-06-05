import express from "express";
import ViewCount from "../models/viewcount.model.js";

const router = express.Router();

router.get("/count", async (req, res) => {
  try {
    if (!req.session.hasVisited) {
      req.session.hasVisited = true;

      let view = await ViewCount.findOne();
      if (!view) {
        view = new ViewCount({ total: 1 });
      } else {
        view.total += 1;
      }
      await view.save();
    }

    // Trả về số lượt xem
    const current = await ViewCount.findOne();
    res.json({ totalViews: current?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
