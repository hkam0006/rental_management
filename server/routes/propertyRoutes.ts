import express from 'express';
import {getProperties, getProperty, createProperty} from '../controllers/propertyControllers';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()})

const router = express.Router();

router.get("/", getProperties)
router.get("/:id", getProperty)
router.post("/",
  authMiddleware(['manager']),
  upload.array("photos"),
  createProperty
)

export default router;