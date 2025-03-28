import express from 'express';
import {getLeases, getLeasePayments} from '../controllers/leaseControllers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get("/", getLeases)
router.get("/:id", getLeasePayments)


export default router;