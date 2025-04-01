import { Request, Response } from "express";
import { registerSchema } from "../schemas/auth.schema";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

export async function register(request: Request, response: Response): Promise<any> {

  const requestedData = request.body;

  const { success, error, data } = registerSchema.safeParse(requestedData);

  if (!success) {
    return response.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error
    })
  }

  try {

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (existingUser) {
      return response.status(500).json({ success: false, message: "Email already used." })
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hash,
        role: {
          connect: {
            id: data.roleId
          }
        }
      }
    });

    return response.status(200).json({ success: true, message: 'User created !', data: newUser })
  } catch (error) {

    return response.status(500).json({ success: false, message: 'Server error', error: error })
  }

};