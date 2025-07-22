import express from "express";
import { addAsset, getAsset , getAssetById } from '../controllers/asset.controller.js';
import { verifyToken } from "../utils/verifyUser.js";
// import { errorHandler } from '../utils/error.js';    

const router = express.Router();

router.get('/',  getAsset);
router.post('/', verifyToken, addAsset);
router.get('/:id' , getAssetById)

export default router;