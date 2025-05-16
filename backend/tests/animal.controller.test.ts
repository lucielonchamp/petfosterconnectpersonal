import { Prisma, Animal, AnimalStatus } from '@prisma/client';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { RoleEnum } from '../src/interfaces/role';
import { NextFunction, Response, Request } from 'express';

// Déclaration globale pour req.user (si elle n'est pas déjà dans un fichier .d.ts global)
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// --- MOCKS ---
// Doivent être en haut, avant les imports de 'app' ou des contrôleurs

// 1. Mock pour Prisma Client
const mockPrismaClient = {
  animal: {
    create: jest.fn(async (args: Prisma.AnimalCreateArgs): Promise<Animal> => {
      const { data } = args;
      return {
        id: 'mocked-animal-id',
        name: data.name,
        picture: data.picture || '',
        specieId: data.specieId || '',
        breed: data.breed,
        sex: data.sex,
        age: data.age,
        description: data.description,
        status: data.status as AnimalStatus,
        shelterId: data.shelterId || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        fosterId: null,
      };
    }),
  },
  $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client') as typeof import('@prisma/client'); // Obtenez le module réel
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    // Exportez les Enums et autres types directement depuis le module réel
    AnimalStatus: actualPrisma.AnimalStatus,
    Prisma: {
      PrismaClientKnownRequestError: actualPrisma.Prisma.PrismaClientKnownRequestError,
      // ... autres types Prisma si nécessaire
    },
    // Si vous avez besoin d'autres exports de @prisma/client, ajoutez-les ici
    // en utilisant actualPrisma.NOM_DE_L_EXPORT
  };
});

// 2. Mock pour csrfMiddleware
jest.mock('../src/middlewares/csrfMiddleware', () => ({
  validateCsrfToken: (req: Request, res: Response, next: NextFunction) => {
    // console.log('MOCK validateCsrfToken CALLED - SKIPPING CSRF CHECK');
    next();
  },
  generateCsrfToken: (req: Request, res: Response, next: NextFunction) => {
    // console.log('MOCK generateCsrfToken (from csrfMiddleware) CALLED');
    res.status(200).json({ csrfToken: 'mocked-csrf-token-from-csrf-module' });
  },
}));

// 3. Mock pour authMiddleware
jest.mock('../src/middlewares/authMiddleware', () => {
  // console.log('AUTH MIDDLEWARE MODULE MOCKED');
  return {
    authMiddleware: (req: Request, res: Response, next: NextFunction) => {
      // console.log('MOCK authMiddleware EXECUTED');
      req.user = {
        id: 'mocked-user-id',
        role: RoleEnum.SHELTER, // Assurez-vous que RoleEnum est bien importé ou défini
      };
      next();
    },
    roleMiddleware: (allowedRoles: string[]) => {
      // console.log('MOCK roleMiddleware CONFIGURED with roles:', allowedRoles);
      return (req: Request, res: Response, next: NextFunction) => {
        // console.log('MOCK roleMiddleware EXECUTED - User role:', req.user?.role, 'Allowed roles:', allowedRoles);
        if (req.user && req.user.role && allowedRoles.includes(req.user.role)) {
          next();
        } else {
          res
            .status(403)
            .json({ success: false, message: 'Accès refusé - Rôle insuffisant (mock)' });
        }
      };
    },
    isFosterOwnerMiddleware: (req: Request, res: Response, next: NextFunction) => {
      // console.log('MOCK isFosterOwnerMiddleware EXECUTED');
      next();
    },
  };
});

// --- IMPORTS APRÈS LES MOCKS ---
import request from 'supertest';
import { app } from '../src/index';

// --- TESTS ---
describe('Animal Controller - createAnimal', () => {
  beforeEach(() => {
    mockPrismaClient.animal.create.mockReset();
    mockPrismaClient.$disconnect.mockReset();
  });

  it('should create a new animal successfully', async () => {
    const mockAnimalData = {
      name: 'Buddy',
      age: 3,
      specieId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
      breed: 'Golden Retriever',
      description: 'Friendly and playful',
      sex: 'male',
      shelterId: 'a3b4c5d6-e7f8-9012-3456-01234567890a',
    };

    const expectedCreatedAnimal: Animal = {
      id: 'generated-animal-uuid',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: mockAnimalData.name,
      age: mockAnimalData.age,
      specieId: mockAnimalData.specieId,
      breed: mockAnimalData.breed,
      description: mockAnimalData.description,
      sex: mockAnimalData.sex,
      shelterId: mockAnimalData.shelterId,
      picture: '',
      status: AnimalStatus.sheltered,
      fosterId: null,
    };

    mockPrismaClient.animal.create.mockResolvedValue(expectedCreatedAnimal);

    const response = await request(app)
      .post('/animal')
      .field('name', mockAnimalData.name)
      .field('age', mockAnimalData.age.toString())
      .field('specieId', mockAnimalData.specieId)
      .field('breed', mockAnimalData.breed)
      .field('description', mockAnimalData.description)
      .field('sex', mockAnimalData.sex)
      .field('shelterId', mockAnimalData.shelterId);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id', expectedCreatedAnimal.id);
    expect(response.body.data.name).toBe(mockAnimalData.name);
    expect(response.body.data.age).toBe(mockAnimalData.age);

    expect(mockPrismaClient.animal.create).toHaveBeenCalledWith({
      data: {
        name: mockAnimalData.name,
        age: mockAnimalData.age,
        breed: mockAnimalData.breed,
        description: mockAnimalData.description,
        sex: mockAnimalData.sex.toString().toLowerCase(),
        picture: '',
        status: AnimalStatus.sheltered,
        shelter: {
          connect: {
            id: mockAnimalData.shelterId,
          },
        },
        specie: {
          connect: {
            id: mockAnimalData.specieId,
          },
        },
      },
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/animal').send({}); // Envoyez un corps vide

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe('Tous les champs sont requis');
  });

  it('should return 500 if there is a server error during Prisma operation', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Supprime le log

    const mockAnimalData = {
      name: 'Buddy',
      age: 3,
      specieId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
      breed: 'Golden Retriever',
      description: 'Friendly and playful',
      sex: 'male',
      shelterId: 'a3b4c5d6-e7f8-9012-3456-01234567890a',
    };

    // Simulez une erreur Prisma
    mockPrismaClient.animal.create.mockRejectedValue(new Error('Database connection error'));

    const response = await request(app)
      .post('/animal')
      .field('name', mockAnimalData.name)
      .field('age', mockAnimalData.age.toString())
      .field('specieId', mockAnimalData.specieId)
      .field('breed', mockAnimalData.breed)
      .field('description', mockAnimalData.description)
      .field('sex', mockAnimalData.sex)
      .field('shelterId', mockAnimalData.shelterId);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Erreur lors de la création de l'animal");

    consoleErrorSpy.mockRestore();
  });
});
