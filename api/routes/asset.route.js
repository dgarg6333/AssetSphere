import express from "express";
import { addAsset, getAsset , getAssetById , myAssets} from '../controllers/asset.controller.js';
import { verifyToken } from "../utils/verifyUser.js";   

const router = express.Router();

router.get('/',  getAsset);
router.post('/', verifyToken, addAsset);
router.get('/:id' , getAssetById);
router.get('/myasset/:userId', myAssets);

export default router;