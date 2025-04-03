import { Request, Response } from "express";
import { PrismaClient, Shelter, Foster, User } from "@prisma/client";
import { updateUserSchema, updateUserShelterSchema, updateUserFosterSchema } from "../schemas/user.schema";
import bcrypt from "bcryptjs";
import { ApiResponse, ErrorResponse } from "../interfaces/response";
import { z } from "zod";
import { ShelterWithUser } from "../interfaces/shelter";
import { RoleEnum } from "../interfaces/role";


const prisma = new PrismaClient();

export async function getUsers(request: Request, response: Response): Promise<any> {

  try {
    const users = await prisma.user.findMany();

    if (!users) {
      return response.status(404).json({
        success: false,
        message: 'Users not found',
        error: 'Users not found'
      })
    };

    return response.status(200).json({
      success: true,
      message: 'Users found',
      data: users
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error
    })
  }
};

export async function getUserById(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({
      success: false,
      message: 'User ID is required'
    })
  }

  try {

    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if (!user) {
      return response.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return response.status(200).json({
      success: true,
      message: `User ${id} found`,
      data: user
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error
    })
  }
};

export async function updateUser(request: Request, response: Response): Promise<any> {
  const { id } = request.params;
  const requestedData = request.body;

  if (!id) {
    return response.status(400).json({
      success: false,
      message: 'User ID is required'
    })
  }

  const { data, success, error } = updateUserSchema.safeParse(requestedData);

  if (!success) {
    return response.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error
    })
  }

  try {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id
      },
      data: data
    })

    return response.status(200).json({
      success: true,
      message: `User ${id} updated`,
      data: updatedUser
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error updating user',
    });
  }

};

export async function deleteUser(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: id
      }
    })

    // TODO : delete shelter if user is a shelter, delete foster if user is a foster

    return response.status(200).json({
      success: true,
      message: `User ${id} deleted`,
      data: deletedUser
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error
    })
  }


}

export async function updateUserWithShelter(
  req: Request<{ id: string }, {}, z.infer<typeof updateUserShelterSchema>>,
  res: Response<ApiResponse<User> | ErrorResponse>
): Promise<void> {
  const { id } = req.params;
  const requestedData = req.body;

  const { data, success, error } = updateUserShelterSchema.safeParse(requestedData);

  if (!success) {
    res.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error
    })
    return;
  }

  try {
    // Hacher le mot de passe s'il est fourni
    let hashedPassword;
    if (data?.user?.password) {
      hashedPassword = await bcrypt.hash(data.user.password, 10);
    }

    const updatedEntity = await prisma.user.update({
      where: { id: id },
      data: {
        email: data?.user?.email,
        ...(hashedPassword && { password: hashedPassword }),
        roleId: data?.user?.roleId,
        Shelter: {
          update: {
            where: { userId: id },
            data: {
              name: data?.name,
              location: data?.location,
              description: data?.description
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedEntity
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating profile", error });
  }
}

export async function getUserWithShelter(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Shelter: true
      }
    });

    if (!user) {
      return response.status(404).json({ success: false, message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    console.log('user', userWithoutPassword);

    return response.status(200).json({ success: true, message: "User with shelter fetched successfully", data: userWithoutPassword });
  } catch (error) {
    return response.status(500).json({ success: false, message: "Error fetching user with shelter", error });
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
      error: error
    })
    return;
  }

  try {
    // Récupérer le foster associé à l'utilisateur
    const foster = await prisma.foster.findFirst({
      where: { userId: id }
    });

    if (!foster) {
      res.status(404).json({
        success: false,
        message: 'Foster not found'
      });
      return;
    }

    // Hacher le mot de passe s'il est fourni
    let hashedPassword;
    if (data?.user?.password) {
      hashedPassword = await bcrypt.hash(data.user.password, 10);
    }

    const updatedEntity = await prisma.user.update({
      where: { id: id },
      data: {
        email: data?.user?.email,
        ...(hashedPassword && { password: hashedPassword }),
        roleId: data?.user?.roleId,
        Foster: {
          update: {
            where: { id: foster.id },
            data: {
              firstName: data?.firstName,
              lastName: data?.lastName,
              address: data?.address
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedEntity
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating profile", error });
  }
}

export async function getUserWithFoster(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Foster: true
      }
    });

    if (!user) {
      return response.status(404).json({ success: false, message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    console.log('user', userWithoutPassword);

    return response.status(200).json({ success: true, message: "User with foster fetched successfully", data: userWithoutPassword });
  } catch (error) {
    return response.status(500).json({ success: false, message: "Error fetching user with foster", error });
  }
}