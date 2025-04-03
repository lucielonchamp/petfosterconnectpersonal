import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, ErrorResponse } from "../interfaces/response";
import { Foster, FosterWithUser } from "../interfaces/foster";
import { createFosterSchema, updateFosterSchema } from "../schemas/foster.schema";

const prisma = new PrismaClient();

export async function getFoster(request: Request, response: Response<ApiResponse<FosterWithUser[]> | ErrorResponse>): Promise<any> {
    try {
        const foster = await prisma.foster.findMany({
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

        if (!foster) {
            return response.status(404).json({
                success: false,
                message: 'Families not found',
                error: 'Families not found'
            })
        };

        return response.status(200).json({
            success: true,
            message: 'Families found',
            data: foster
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error fetching foster families',
            error: error
        })
    }
}

export async function getFosterById(request: Request<{ id: string }>, response: Response<ApiResponse<FosterWithUser> | ErrorResponse>): Promise<any> {
    const { id } = request.params;

    if (!id) {
        return response.status(400).json({
            success: false,
            message: 'Foster family ID is required'
        })
    }

    try {
        const foster = await prisma.foster.findUnique({
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

        if (!foster) {
            return response.status(404).json({
                success: false,
                message: 'Foster family not found'
            })
        }

        return response.status(200).json({
            success: true,
            message: `Foster family ${id} found`,
            data: foster
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error fetching foster family',
            error: error
        })
    }
};

export async function getAnimalsByFoster(request: Request<{ id: string }>, response: Response): Promise<any> {
    const { id } = request.params;

    if (!id) {
        return response.status(400).json({
            success: false,
            message: 'Foster ID is required',
        });
    }

    try {
        const fosterWithAnimals = await prisma.foster.findUnique({
            where: { id },
            include: {
              animals: {
                include: {
                  specie: true,
                },
              },
            },
          });

        if (!fosterWithAnimals) {
            return response.status(404).json({
                success: false,
                message: 'Foster Animal not found',
                error: 'Foster Animal not found'
            })
        };

        return response.status(200).json({
            success: true,
            message: 'Foster Animal found',
            data: fosterWithAnimals
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error fetching Foster Animal',
            error: error
        })
    }
}

export async function createFoster(
  req: Request<{}, {}, Omit<Foster, 'id' | 'createdAt' | 'updatedAt'>>,
  res: Response<ApiResponse<Foster> | ErrorResponse>
): Promise<void> {
  const requestBody = req.body;

  const { success, data, error } = createFosterSchema.safeParse(requestBody);

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

    const foster = await prisma.foster.create({
      data
    });

    res.status(201).json({
      success: true,
      message: 'Shelter created successfully',
      data: foster
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating shelter", error });
  }
}

export async function updateFoster(
  req: Request<{ id: string }, {}, Partial<Omit<Foster, 'id' | 'createdAt' | 'updatedAt'>>>,
  res: Response<ApiResponse<Foster> | ErrorResponse>
): Promise<void> {
  const { id } = req.params;
  const requestBody = req.body;

  const { success, data, error } = updateFosterSchema.safeParse(requestBody);

  if (!success) {
    res.status(400).json({ message: "Invalid data", error });
    return;
  }

  try {
    const foster = await prisma.foster.update({
      where: { id },
      data
    });

    res.status(200).json({
      success: true,
      message: 'Foster updated successfully',
      data: foster
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating foster", error });
  }
}

export async function deleteFoster(request: Request<{ id: string }>, response: Response<ApiResponse<Foster> | ErrorResponse>): Promise<any> {

    const { id } = request.params;

    try {
        const deletedFoster = await prisma.foster.delete({
            where: {
                id
            }
        });

        if (!id) {
            return response.status(400).json({
                success: false,
                message: 'Foster family ID is required'
            })
        }

        return response.status(200).json({
            success: true,
            message: `Foster Family ${id} deleted`,
            data: deletedFoster
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error
        })
    }
}