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

export async function getAnimalById(request: Request, response: Response): Promise<any> {
    const { id } = request.params;

    if (!id) {
        return response.status(400).json({
            success: false,
            message: 'Animal ID is required'
        })
    }

    try {

        const animal = await prisma.animal.findUnique({
            where: {
                id: id
            }
        });

        if (!animal) {
            return response.status(404).json({
                success: false,
                message: 'Animal not found'
            })
        }

        return response.status(200).json({
            success: true,
            message: `Animal ${id} found`,
            data: animal
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error fetching animal',
            error: error
        })
    }
};