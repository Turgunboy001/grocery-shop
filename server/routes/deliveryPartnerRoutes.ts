import express from "express";
import {
  cancelDelivery,
  complateDelivery,
  getDeliveryDetails,
  getMyDeliveries,
  loginPartner,
  updateDeliveryStatus,
  updateLocation,
} from "../controllers/deliveryPartnerController.js";
import deliveryAuth from "../middleware/deliveryAuth.js";

const deliveryPartnerRoutes = express.Router();
deliveryPartnerRoutes.post("/login", loginPartner);
deliveryPartnerRoutes.get("/my-deliveries", deliveryAuth, getMyDeliveries);
deliveryPartnerRoutes.get(
  "/my-deliveries/:id",
  deliveryAuth,
  getDeliveryDetails,
);
deliveryPartnerRoutes.put(
  "/my-deliveries/:id/complate",
  deliveryAuth,
  complateDelivery,
);
deliveryPartnerRoutes.put(
  "/my-deliveries/:id/cancel",
  deliveryAuth,
  cancelDelivery,
);
deliveryPartnerRoutes.put(
  "/my-deliveries/:id/status",
  deliveryAuth,
  updateDeliveryStatus,
);
deliveryPartnerRoutes.put(
  "/my-deliveries/:id/location",
  deliveryAuth,
  updateLocation,
);

export default deliveryPartnerRoutes;
