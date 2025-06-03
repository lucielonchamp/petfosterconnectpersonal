import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createSchema } from '../schemas/role.schema';

const prisma = new PrismaClient();

export async function getRole(request: Request, response: Response): Promise<any> {
  try {
    const roles = await prisma.role.findMany();

    if (!roles) {
      return response.status(409).json({
        success: false,
        message: 'Invalid data',
      });
    }
    return response
      .status(200)
      .json({ success: true, message: 'Roles correctly received', data: roles });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}

export async function createRole(request: Request, response: Response): Promise<any> {
  const requestedData = request.body;

  const { success, error, data } = createSchema.safeParse(requestedData);

  if (!success) {
    return response.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error,
    });
  }

  try {
    const existingRole = await prisma.role.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existingRole) {
      return response.status(409).json({
        success: false,
        message: 'This role already exists',
      });
    }

    const newRole = await prisma.role.create({
      data: {
        name: data.name,
      },
    });

    return response
      .status(201)
      .json({ success: true, message: 'Role successfully created', data: newRole });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}
