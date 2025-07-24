import express from "express";
// import { verifyToken } from "../utils/verifyUser.js";
import { createBooking } from "../controllers/booking.controller.js"; 

const router = express.Router();

router.post('/:assetId', createBooking);

export default router;