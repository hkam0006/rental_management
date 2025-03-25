import {Response, Request} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const manager = await prisma.manager.findUnique({
      where: {
        cognitoId
      }
    });
    if (manager ) {
      res.json(manager);
    } else {
      res.status(404).json({ message: "Manager not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: ` Error retrieving manager: ${err.message}` });
  }
};

export const createManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId, email, name, phoneNumber } = req.body;
    const manager = await prisma.manager.create({
      data: {
        cognitoId,
        email,
        name,
        phoneNumber
      }
    });
    res.status(201).json(manager);
  } catch (err: any) {
    res.status(500).json({ message: ` Error creating manager: ${err.message}` });
  }
}

export const updateManager = async (req: Request, res: Response) : Promise<void> => {
  try {
    const {cognitoId} = req.params;
    const { email, name, phoneNumber } = req.body;
    const updatedManager = await prisma.manager.update({
      where: {cognitoId},
      data: {
        email,
        name,
        phoneNumber
      }
    });
    res.json(updatedManager);
  } catch (err: any) {
    res.status(500).json({ message: ` Error updating manager: ${err.message}` });
  }
}