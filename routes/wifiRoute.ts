import { Router } from "express";
import {
  deleteWifi,
  getUserWifi,
  getWifi,
  getWifis,
  postWifi,
} from "../controllers/wifiController";
import { Test } from "../entities";
import { DI } from "../index";
import { QueryOrder } from "@mikro-orm/core";

const router: Router = Router();

router.post("/postWifi", postWifi);

router.get("/getUserWifi/:id", getUserWifi);
router.get("/getWifi/:id", getWifi);
router.get("/getWifis", getWifis);

router.delete("/deleteWifi/:id", deleteWifi);

router.get("/getSignals/:limit", async (req, res) => {
  const { limit } = req.params;
  const signals = await DI.em.find(Test, {}, {
    fields: ["location", "signalStrength"],
    orderBy: {
      signalStrength: QueryOrder.ASC,
    },
    limit: +limit,
  });
  res.send(signals);
});

export default router;
