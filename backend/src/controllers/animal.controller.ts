import { AnimalStatus, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { deleteFromS3, generateFileName, upload, uploadToS3 } from '../utils/s3upload';


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
        shelter: true
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

export const createAnimal = [
  upload.single('picture'),
  async (request: Request & { user?: { id: string } }, response: Response): Promise<any> => {
    const { name, age, specieId, breed, description, sex, shelterId } = request.body;

    if (!name || !age || !specieId || !breed || !description || !sex || !shelterId) {
      return response.status(400).json({
        success: false,
        message: 'Tous les champs sont requis',
      });
    }

    try {
      let pictureUrl = '';

      if (request.file) {
        try {
          const fileName = generateFileName(name, request.file.originalname);
          pictureUrl = await uploadToS3(request.file, 'animals', fileName);
        } catch (uploadError) {
          console.error('Erreur upload S3:', uploadError);
          return response.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image',
            error: uploadError,
          });
        }
      }

      const animal = await prisma.animal.create({
        data: {
          name,
          age: parseInt(age),
          breed,
          description,
          picture: pictureUrl,
          sex,
          status: AnimalStatus.sheltered,
          specie: {
            connect: { id: specieId },
          },
          shelter: {
            connect: { id: shelterId },
          },
        },
      });

      return response.status(201).json({
        success: true,
        message: 'Animal créé avec succès',
        data: animal,
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'animal',
        error: error,
      });
    }
  }
];

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

export const updateAnimal = [
  upload.single('picture'),
  async (request: Request & { user?: { id: string } }, response: Response): Promise<any> => {
    const { id } = request.params;
    const { name, age, specieId, breed, description, sex, shelterId } = request.body;
    const userId = request.user?.id;

    if (!id) {
      return response.status(400).json({
        success: false,
        message: 'ID de l\'animal requis',
      });
    }

    try {
      let pictureUrl = '';
      let oldPictureUrl = '';

      // Récupérer l'ancienne image
      const existingAnimal = await prisma.animal.findUnique({
        where: { id },
        select: { picture: true },
      });

      if (existingAnimal?.picture) {
        oldPictureUrl = existingAnimal.picture;
      }

      if (request.file) {
        try {
          const fileName = generateFileName(name, request.file.originalname);
          pictureUrl = await uploadToS3(request.file, 'animals', fileName);

          // Supprimer l'ancienne image si elle existe
          if (oldPictureUrl) {
            await deleteFromS3(oldPictureUrl);
          }
        } catch (uploadError) {
          console.error('Erreur upload S3:', uploadError);
          return response.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image',
            error: uploadError,
          });
        }
      }

      const updateData: any = {
        name,
        age: parseInt(age),
        breed,
        description,
        sex,
        specie: {
          connect: { id: specieId },
        },
        shelter: {
          connect: { id: shelterId },
        },
      };

      if (pictureUrl) {
        updateData.picture = pictureUrl;
      }

      const animal = await prisma.animal.update({
        where: { id },
        data: updateData,
      });

      return response.status(200).json({
        success: true,
        message: 'Animal mis à jour avec succès',
        data: animal,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'animal',
        error: error,
      });
    }
  }
];

export async function deleteAnimal(request: Request, response: Response): Promise<any> {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({
      success: false,
      message: 'ID de l\'animal requis',
    });
  }

  try {
    // Récupérer l'animal pour avoir l'URL de l'image
    const animal = await prisma.animal.findUnique({
      where: { id },
      select: { picture: true },
    });

    if (!animal) {
      return response.status(404).json({
        success: false,
        message: 'Animal non trouvé',
      });
    }

    // Supprimer l'image S3 si elle existe
    if (animal.picture) {
      await deleteFromS3(animal.picture);
    }

    // Supprimer l'animal
    await prisma.animal.delete({
      where: { id },
    });

    return response.status(200).json({
      success: true,
      message: 'Animal supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return response.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'animal',
      error: error,
    });
  }
}
