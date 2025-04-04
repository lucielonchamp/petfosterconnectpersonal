import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function getAnimals(request: Request, response: Response): Promise<any> {
    try {
        const animals = await prisma.animal.findMany();

        if (!animals) {
            return response.status(409).json({
                success: false,
                message: 'Invalid data',
            })
        }
        return response.status(200).json({ success: true, message: 'animals correctly received', data: animals })
    } catch (error) {
        return response.status(500).json({
            success: false, message: 'Server error'
        })
    }
};
