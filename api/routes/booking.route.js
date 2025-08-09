import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createBooking, myBookings , cancelBooking } from "../controllers/booking.controller.js"; 

const router = express.Router();

router.post('/:assetId',  verifyToken , createBooking);
router.get('/:userId' , myBookings)
router.patch('/cancel/:bookingId', verifyToken, cancelBooking);


export default router;