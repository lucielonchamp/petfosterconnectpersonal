import { Request, Response } from "express";
import { PrismaClient, Shelter } from "@prisma/client";
import { createShelterSchema, updateShelterSchema } from "../schemas/shelter.schema";
import { ApiResponse, ErrorResponse } from "../interfaces/response";
import { ShelterWithUser } from "../interfaces/shelter";

const prisma = new PrismaClient();


export async function getShelters(
  req: Request,
  res: Response<ApiResponse<ShelterWithUser[]> | ErrorResponse>
): Promise<void> {
  try {
    const shelters = await prisma.shelter.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            roleId: true
          }
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Shelters fetched successfully',
      data: shelters
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching shelters", error });
  }
}

export async function getShelterById(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<ShelterWithUser> | ErrorResponse>
): Promise<void> {
  const { id } = req.params;

  try {
    const shelter = await prisma.shelter.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            roleId: true
          }
        },
      },
    });

    if (!shelter) {
      res.status(404).json({
        message: "Shelter not found",
        error: "Shelter not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Shelter fetched successfully',
      data: shelter
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching shelter", error });
  }
}

export async function createShelter(
  req: Request<{}, {}, Omit<Shelter, 'id' | 'createdAt' | 'updatedAt'>>,
  res: Response<ApiResponse<Shelter> | ErrorResponse>
): Promise<void> {
  const requestBody = req.body;

  const { success, data, error } = createShelterSchema.safeParse(requestBody);

  if (!success) {
    res.status(400).json({ message: "Invalid data", error });
    return;
  }

  try {
    const existingShelter = await prisma.shelter.findFirst({
      where: {
        userId: data.userId,
      },
    });

    const existingFoster = await prisma.foster.findFirst({
      where: {
        userId: data.userId,
      },
    });

    if (existingShelter || existingFoster) {
      res.status(409).json({
        message: "User already has a shelter or foster",
        error: "User already has a shelter or foster"
      });
      return;
    }

    const shelter = await prisma.shelter.create({
      data
    });

    res.status(201).json({
      success: true,
      message: 'Shelter created successfully',
      data: shelter
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating shelter", error });
  }
}

export async function updateShelter(
  req: Request<{ id: string }, {}, Partial<Omit<Shelter, 'id' | 'createdAt' | 'updatedAt'>>>,
  res: Response<ApiResponse<Shelter> | ErrorResponse>
): Promise<void> {
  const { id } = req.params;
  const requestBody = req.body;

  const { success, data, error } = updateShelterSchema.safeParse(requestBody);

  if (!success) {
    res.status(400).json({ message: "Invalid data", error });
    return;
  }

  try {
    const shelter = await prisma.shelter.update({
      where: { id },
      data
    });

    res.status(200).json({
      success: true,
      message: 'Shelter updated successfully',
      data: shelter
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating shelter", error });
  }
}

export async function deleteShelter(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Shelter> | ErrorResponse>
): Promise<void> {
  const { id } = req.params;

  try {
    const deletedShelter = await prisma.shelter.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Shelter deleted successfully',
      data: deletedShelter
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting shelter", error });
  }
} 