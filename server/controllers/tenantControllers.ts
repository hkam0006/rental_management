import {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: {
        cognitoId
      },
      include: {
        favorites: true
      }
    });
    if (tenant ) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: ` Error retrieving tenant: ${err.message}` });
  }
};

export const createTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId, email, name, phoneNumber } = req.body;
    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        email,
        name,
        phoneNumber
      }
    });
    res.status(201).json(tenant);
  } catch (err: any) {
    res.status(500).json({ message: ` Error creating tenant: ${err.message}` });
  }
}