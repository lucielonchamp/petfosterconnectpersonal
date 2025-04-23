import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function getAnimals(request: Request, response: Response): Promise<any> {
  try {
    const { sex, specieId, breed, minAge, maxAge, status, fosterId, shelterId } = request.query;

    // Construire l'objet de filtrage dynamiquement
    const whereClause: any = {};

    if (sex) {
      whereClause.sex = sex;
    }

    if (specieId) {
      whereClause.specieId = specieId;
    }

    if (breed) {
      whereClause.breed = {
        contains: breed,
        mode: 'insensitive'
      };
    }

    if (minAge || maxAge) {
      whereClause.age = {};

      if (minAge) {
        whereClause.age.gte = parseInt(minAge as string);
      }

      if (maxAge) {
        whereClause.age.lte = parseInt(maxAge as string);
      }
    }

    if (status) {
      // Gérer le cas où status est un tableau
      if (Array.isArray(status)) {
        whereClause.status = {
          in: status
        };
      } else {
        whereClause.status = status;
      }
    }

    if (sex) {
      // Gérer le cas où status est un tableau
      if (Array.isArray(sex)) {
        whereClause.sex = {
          in: status
        };
      } else {
        whereClause.status = status;
      }
    }

    if (specieId) {
      // Gérer le cas où specieId est un tableau
      if (Array.isArray(specieId)) {
        whereClause.specieId = {
          in: specieId
        };
      } else {
        whereClause.specieId = specieId;
      }
    }

    // Ajout des filtres par ID
    if (fosterId) {
      whereClause.fosterId = fosterId;
    }

    if (shelterId) {
      // Gérer le cas où shelterId est un tableau
      if (Array.isArray(shelterId)) {
        whereClause.shelterId = {
          in: shelterId
        };
      } else {
        whereClause.shelterId = shelterId;
      }
    }

    const animals = await prisma.animal.findMany({
      where: whereClause,
      include: {
        specie: {
          select: {
            id: true,
            name: true
          }
        },
        shelter: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        Foster: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return response
      .status(200)
      .json({
        success: true,
        message: 'animals correctly received',
        data: animals
      });

  } catch (error) {
    console.error('Error in getAnimals:', error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
      error: error
    });
  }
}

export async function getAnimalById(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({
      success: false,
      message: 'Animal ID is required',
    });
  }

  try {
    const animal = await prisma.animal.findUnique({
      where: {
        id: id,
      },
      include: {
        specie: true,
        shelter: {
          select: {
            id: true,
            name: true,
            location: true,
            description: true,
          }
        },
      },
    });

    if (!animal) {
      return response.status(404).json({
        success: false,
        message: 'Animal not found',
      });
    }

    return response.status(200).json({
      success: true,
      message: `Animal ${id} found`,
      data: animal,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error fetching animal',
      error: error,
    });
  }
}

export async function createAnimal(request: Request, response: Response): Promise<any> {
  const { name, age, specie, breed, description, picture, sex, status } = request.body;

  if (!name || !age || !specie || !breed || !description) {
    return response.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    const animal = await prisma.animal.create({
      data: {
        name,
        age,
        breed,
        description,
        // Add these required fields:
        picture: request.body.picture, // Or provide a default value
        sex: request.body.sex, // Or provide a default value
        status: request.body.status, // Must be a valid AnimalStatus enum value
        // For relation fields, use connect to link existing records
        specie: {
          connect: { id: specie }, // Assuming 'specie' is the ID of an existing specie
        },
        shelter: {
          connect: { id: request.body.shelterId }, // Assuming you have a shelterId in the request
        },
      },
    });

    return response.status(201).json({
      success: true,
      message: 'Animal created successfully',
      data: animal,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error creating animal',
      error: error,
    });
  }
}

export async function getAnimalsByShelter(request: Request, response: Response): Promise<any> {
  const { shelterId } = request.params;

  if (!shelterId) {
    return response.status(400).json({
      success: false,
      message: 'Shelter ID is required',
    });
  }

  try {
    const animals = await prisma.animal.findMany({
      where: {
        shelterId: shelterId,
      },
      include: {
        specie: true,
      }
    });

    if (!animals) {
      return response.status(404).json({
        success: false,
        message: 'No animals found for this shelter',
      });
    }

    return response.status(200).json({
      success: true,
      message: `Animals for shelter ${shelterId} found`,
      data: animals,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error fetching animals',
      error: error,
    });
  }
}

export async function getAnimalsByFoster(request: Request, response: Response): Promise<any> {
  const { fosterId } = request.params;

  if (!fosterId) {
    return response.status(400).json({
      success: false,
      message: 'Foster ID is required',
    });
  }

  try {
    const animals = await prisma.animal.findMany({
      where: {
        fosterId: fosterId,
      },
      include: {
        specie: true,
      }
    });

    if (animals.length === 0) {
      return response.status(404).json({
        success: false,
        message: 'No animals found for this foster',
      });
    }

    return response.status(200).json({
      success: true,
      message: `Animals for foster ${fosterId} found`,
      data: animals,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Error fetching animals',
      error: error,
    });
  }
}
