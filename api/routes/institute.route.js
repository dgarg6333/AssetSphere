import express from "express";
import  {addInstitute , getInstituteByEmail} from '../controllers/institute.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/', verifyToken,  addInstitute);
router.get('/:emailId', verifyToken, getInstituteByEmail);

export default router;