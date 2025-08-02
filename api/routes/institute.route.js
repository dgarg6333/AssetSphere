import express from "express";
import  {addInstitute} from '../controllers/institute.controller.js';

const router = express.Router();

router.post('/',  addInstitute);

export default router;