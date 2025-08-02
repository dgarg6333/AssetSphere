import express from "express";
import  {addInstitute , getInstituteByEmail} from '../controllers/institute.controller.js';

const router = express.Router();

router.post('/',  addInstitute);
router.get('/:emailId', getInstituteByEmail);

export default router;