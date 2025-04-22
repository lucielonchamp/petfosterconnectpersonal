import { Request, Response } from 'express';
import { PrismaClient, Shelter, Foster, User, Prisma } from '@prisma/client';
import {
  updateUserSchema,
  updateUserShelterSchema,
  updateUserFosterSchema,
} from '../schemas/user.schema';
import bcrypt from 'bcryptjs';
import { ApiResponse, ErrorResponse } from '../interfaces/response';
import { z } from 'zod';
import { ShelterWithUser } from '../interfaces/shelter';
import { RoleEnum } from '../interfaces/role';

const prisma = new PrismaClient();

export async function getUsers(request: Request, response: Response): Promise<any> {
  try {
    const users = await prisma.user.findMany();

    if (!users) {
      return response.status(404).json({
        success: false,
        message: 'Users not found',
        error: 'Users not found',
      });
    }

    return response.status(200).json({
      success: true,
      message: 'Users found',
      data: users,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error,
    });
  }
}

export async function getUserById(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({
      success: false,
      message: 'User ID is required',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return response.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return response.status(200).json({
      success: true,
      message: `User ${id} found`,
      data: user,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error,
    });
  }
}

export async function updateUser(request: Request, response: Response): Promise<any> {
  const { id } = request.params;
  const requestedData = request.body;

  if (!id) {
    return response.status(400).json({
      success: false,
      message: 'User ID is required',
    });
  }

  const { data, success, error } = updateUserSchema.safeParse(requestedData);

  if (!success) {
    return response.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error,
    });
  }

  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });

    return response.status(200).json({
      success: true,
      message: `User ${id} updated`,
      data: updatedUser,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error updating user',
    });
  }
}

export async function deleteUser(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    // TODO : delete shelter if user is a shelter, delete foster if user is a foster

    return response.status(200).json({
      success: true,
      message: `User ${id} deleted`,
      data: deletedUser,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error,
    });
  }
}

export async function updateUserWithShelter(
  req: Request<{ id: string }, {}, z.infer<typeof updateUserShelterSchema>>,
  res: Response<ApiResponse<User & { Shelter: Shelter | null }> | ApiResponse<null>>
): Promise<void> {
  const { id } = req.params;
  const requestedData = req.body;

  const validationResult = updateUserShelterSchema.safeParse(requestedData);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid input data',
      error: validationResult.error.format(),
    });
    return;
  }

  const data = validationResult.data;

  try {
    const userDataForUpdate: Prisma.UserUpdateInput = {};
    if (data.user?.email) {
      userDataForUpdate.email = data.user.email;
    }
    if (data.user?.password) {
      userDataForUpdate.password = await bcrypt.hash(data.user.password, Number(process.env.SALT_ROUNDS) || 10);
    }

    const shelterCreateData: Prisma.ShelterCreateWithoutUserInput = {
      name: data.name ?? 'Nom manquant',
      location: data.location ?? 'Lieu manquant',
      description: data.description, // Nullable, so undefined is okay
    };

    const shelterUpdateData: Prisma.ShelterUpdateWithoutUserInput = {
      name: data.name,
      location: data.location,
      description: data.description,
    };

    const updatedUserWithShelter = await prisma.user.update({
      where: { id: id },
      data: {
        ...userDataForUpdate,
        Shelter: {
          upsert: {
            create: shelterCreateData,
            update: shelterUpdateData,
          }
        }
      },
      include: {
        Shelter: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'User and Shelter profile updated/created successfully',
      data: updatedUserWithShelter,
    });
    return;

  } catch (error: any) {
    console.error(`Error updating user ${id} with shelter profile:`, error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`,
        error: error.meta ?? error.message,
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = (error.meta?.target as string[])?.join(', ') || 'field';
      res.status(409).json({
        success: false,
        message: `Update failed due to a conflict: ${target} already exists.`,
        error: error.meta
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
    return;
  }
}

export async function getUserWithShelter(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Shelter: true,
      },
    });

    if (!user) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;

    console.log('user', userWithoutPassword);

    return response
      .status(200)
      .json({
        success: true,
        message: 'User with shelter fetched successfully',
        data: userWithoutPassword,
      });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: 'Error fetching user with shelter', error });
  }
}

export async function updateUserWithFoster(
  req: Request<{ id: string }, {}, z.infer<typeof updateUserFosterSchema>>,
  res: Response<ApiResponse<User> | ErrorResponse>
): Promise<void> {
  const { id } = req.params;
  const requestedData = req.body;

  const { data, success, error } = updateUserFosterSchema.safeParse(requestedData);

  if (!success) {
    res.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error,
    });
    return;
  }

  try {
    const userDataForUpdate: Prisma.UserUpdateInput = {};
    if (data.user?.email) {
      userDataForUpdate.email = data.user.email;
    }
    if (data.user?.password) {
      userDataForUpdate.password = await bcrypt.hash(data.user.password, Number(process.env.SALT_ROUNDS) || 10);
    }

    const fosterCreateData: Prisma.FosterCreateWithoutUserInput = {
      firstName: data.firstName ?? 'Prénom manquant',
      lastName: data.lastName ?? 'Nom manquant',
      address: data.address ?? 'Adresse manquante',

    };


    const fosterUpdateData: Prisma.FosterUpdateWithoutUserInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
    };

    const updatedUserWithFoster = await prisma.user.update({
      where: { id: id },
      data: {
        ...userDataForUpdate,

        Foster: {
          upsert: {
            create: fosterCreateData,
            update: fosterUpdateData,
          }
        }
      },
      include: {
        Foster: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'User and Foster profile updated/created successfully',
      data: updatedUserWithFoster,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error updating profile', error });
  }
}

export async function getUserWithFoster(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Foster: true,
      },
    });

    if (!user) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;

    console.log('user', userWithoutPassword);

    return response
      .status(200)
      .json({
        success: true,
        message: 'User with foster fetched successfully',
        data: userWithoutPassword,
      });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: 'Error fetching user with foster', error });
  }
}

export async function anonymizeUser(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Foster: true,
        Shelter: true
      }
    });

    if (!user) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }

    const updates: any = {
      email: `deleted+${user.id}@petfoster.com`,
      password: await bcrypt.hash('deleted-password', 10),
      isRemoved: true
    };

    if (user.Foster) {
      const Foster = await prisma.foster.update({
        where: { id: user.Foster.id },
        data: {
          firstName: '',
          lastName: '',
          address: '',
          isRemoved: true,
          Request: {
            updateMany: {
              where: {},
              data: {
                fosterComment: null,
                shelterComment: null
              }
            }
          }
        }
      });
    }

    if (user.Shelter) {
      await prisma.shelter.update({
        where: { id: user.Shelter.id },
        data: {
          name: '',
          location: '',
          description: null,
          isRemoved: true,
          Request: {
            updateMany: {
              where: {},
              data: {
                fosterComment: null,
                shelterComment: null
              }
            }
          }
        }
      });
    }

    await prisma.user.update({
      where: { id },
      data: updates
    });

    return response.status(200).json({
      success: true,
      message: `User ${id} anonymized`,
    });

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error anonymizing user',
      error
    });
  }
}