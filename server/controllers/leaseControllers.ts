import {Response, Request} from 'express';
import {PrismaClient} from '@prisma/client';
import { wktToGeoJSON } from '@terraformer/wkt';

const prisma = new PrismaClient();

export const getLeases = async (req: Request, res: Response): Promise<void> => {
  try {
    const leases = await prisma.lease.findMany({
      include: {
        tenant: true,
        property: true
      }
    })
    res.json(leases)
  } catch (err: any) {
    res.status(500).json({ message: ` Error retrieving lease ${err.message}` });
  }
};

export const getLeasePayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const {id} = req.params
    const payments = await prisma.payment.findMany({
      where: {leaseId: Number(id)}
    })
    res.json(payments)
  } catch (err: any) {
    res.status(500).json({ message: ` Error retrieving lease payments: ${err.message}` });
  }
};