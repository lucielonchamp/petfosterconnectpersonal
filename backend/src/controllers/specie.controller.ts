import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function getSpecies(request: Request, response: Response): Promise<any> {
    try {
        const species = await prisma.specie.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        return response.status(200).json({
            success: true,
            message: 'Espèces récupérées avec succès',
            data: species
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des espèces:', error);
        return response.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error
        });
    }
} 