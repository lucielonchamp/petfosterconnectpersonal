// src/controllers/request.controller.ts

import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { PrismaClient, RequestStatus, Prisma, AnimalStatus, Request as PrismaRequest } from '@prisma/client';
import { createRequestSchema, updateRequestSchema, queryRequestSchema, paramIdSchema } from '../schemas/request.schema';
import { ApiResponse } from '../interfaces/response';

const prisma = new PrismaClient();

export async function createRequest(
  request: ExpressRequest,
  response: ExpressResponse
): Promise<void> {
  const validation = createRequestSchema.safeParse(request.body);

  if (!validation.success) {
    response.status(400).json({
      success: false,
      message: 'Invalid input data',
      error: validation.error.format(),
    });
    return;
  }

  const { fosterId, fosterComment, animalId } = validation.data;

  try {
    const [animal, foster] = await Promise.all([
      prisma.animal.findUnique({ where: { id: animalId }, include: { shelter: true } }),
      prisma.foster.findUnique({ where: { id: fosterId } }),
    ]);

    if (!foster) {
      response.status(404).json({ success: false, message: `Foster with ID ${fosterId} not found.` });
      return;
    }
    if (!animal) {
      response.status(404).json({ success: false, message: `Animal with ID ${animalId} not found.` });
      return;
    }

    if (animal.status !== AnimalStatus.waiting && animal.status !== AnimalStatus.sheltered) {
      response.status(409).json({
        success: false,
        message: `Animal with ID ${animalId} is not available for fostering (current status: ${animal.status}).`
      });
      return;
    }

    const newRequest = await prisma.request.create({
      data: { fosterId, shelterId: animal.shelterId, animalId, status: RequestStatus.pending, fosterComment },
      include: {
        foster: { select: { id: true, firstName: true, lastName: true } },
        shelter: { select: { id: true, name: true } },
        animal: { select: { id: true, name: true, picture: true } },
      }
    });

    if (newRequest) {
      await prisma.animal.update({
        where: { id: animalId },
        data: { status: AnimalStatus.waiting }
      });
    }

    response.status(201).json({
      success: true,
      message: 'Request successfully created',
      data: newRequest
    });
    return;

  } catch (error: any) {
    console.error("Server error creating request:", error);

    response.status(500).json({
      success: false,
      message: 'Server error while creating request',
      error: error.message
    });
    return;
  }
}

export async function getAllRequests(
  request: ExpressRequest,
  response: ExpressResponse
): Promise<void> {
  try {
    const requests = await prisma.request.findMany({
      include: {
        foster: { select: { id: true, firstName: true, lastName: true } },
        shelter: { select: { id: true, name: true } },
        animal: { select: { id: true, name: true, picture: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    response.status(200).json({
      success: true,
      message: 'All requests successfully retrieved',
      data: requests
    });
    return;

  } catch (error: any) {
    console.error("Server error fetching all requests:", error);
    response.status(500).json({
      success: false,
      message: 'Server error while fetching all requests',
      error: error.message,
    });
    return;
  }
}

export async function getRequestsByUserId(
  request: ExpressRequest,
  response: ExpressResponse
): Promise<void> {

  const paramValidation = paramIdSchema.safeParse(request.params);
  if (!paramValidation.success) {
    response.status(400).json({
      success: false,
      message: 'Invalid User ID format',
      error: paramValidation.error.format(),
    });
    return;
  }
  const { id: userId } = paramValidation.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Foster: { select: { id: true } },
        Shelter: { select: { id: true } }
      }
    });

    if (!user) {
      response.status(404).json({ success: false, message: `User with ID ${userId} not found.` });
      return;
    }

    let requests: PrismaRequest[] = [];
    let message = 'No requests found for this user profile.';

    let whereClause: Prisma.RequestWhereInput = {};

    if (user.Foster) {
      whereClause = { fosterId: user.Foster.id };
      message = `Requests for foster profile ${user.Foster.id} successfully retrieved.`;
    } else if (user.Shelter) {
      whereClause = { shelterId: user.Shelter.id };
      message = `Requests for shelter profile ${user.Shelter.id} successfully retrieved.`;
    } else {
      response.status(200).json({
        success: true,
        message: `User ${userId} found, but has no associated Foster or Shelter profile to link requests.`,
        data: []
      });
      return;
    }

    requests = await prisma.request.findMany({
      where: whereClause,
      include: {
        foster: true,
        shelter: true,
        animal: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    response.status(200).json({
      success: true,
      message: requests.length > 0 ? message : 'No requests found matching the user profile.',
      data: requests
    });
    return;

  } catch (error: any) {
    console.error(`Server error fetching requests for user ${userId}:`, error);
    response.status(500).json({
      success: false,
      message: `Server error while fetching requests for user ${userId}`,
      error: error.message,
    });
    return;
  }
}

export async function getRequestById(
  request: ExpressRequest,
  response: ExpressResponse
): Promise<void> {
  const paramValidation = paramIdSchema.safeParse(request.params);

  if (!paramValidation.success) {
    response.status(400).json({
      success: false,
      message: 'Invalid Request ID format',
      error: paramValidation.error.format(),
    });
    return;
  }
  const { id } = paramValidation.data;

  try {
    const foundRequest = await prisma.request.findUnique({
      where: { id },
      include: { foster: true, shelter: true, animal: true }
    });

    if (!foundRequest) {
      response.status(404).json({
        success: false,
        message: 'Request not found',
      });
      return;
    }

    response.status(200).json({
      success: true,
      message: 'Request successfully retrieved',
      data: foundRequest
    });
    return;

  } catch (error: any) {
    console.error(`Server error fetching request ${id}:`, error);

    response.status(500).json({
      success: false,
      message: 'Server error while fetching request',
      error: error.message,
    });
    return;
  }
}

export async function updateRequest(
  request: ExpressRequest,
  response: ExpressResponse
): Promise<void> {
  const paramValidation = paramIdSchema.safeParse(request.params);
  if (!paramValidation.success) {
    response.status(400).json({ success: false, message: 'Invalid Request ID format', error: paramValidation.error.format() });
    return;
  }
  const { id } = paramValidation.data;

  const bodyValidation = updateRequestSchema.safeParse(request.body);
  if (!bodyValidation.success) {
    response.status(400).json({ success: false, message: 'Invalid input data', error: bodyValidation.error.format() });
    return;
  }

  const { status, fosterComment, shelterComment } = bodyValidation.data;
  const dataToUpdate: Prisma.RequestUpdateInput = {};
  let updateAnsweredDate = false;

  if (status !== undefined) { dataToUpdate.status = status; updateAnsweredDate = true; }
  if (fosterComment !== undefined) { dataToUpdate.fosterComment = fosterComment; }
  if (shelterComment !== undefined) { dataToUpdate.shelterComment = shelterComment; }
  if (updateAnsweredDate) { dataToUpdate.answeredDate = new Date(); }

  if (Object.keys(dataToUpdate).length === 0) {
    response.status(400).json({ success: false, message: 'No valid fields provided for update.' });
    return;
  }
  if ('fosterId' in request.body || 'shelterId' in request.body || 'animalId' in request.body) {
    response.status(400).json({ success: false, message: 'Cannot change foster, shelter, or animal ID via update.' });
    return;
  }

  try {
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: dataToUpdate,
      include: {
        foster: { select: { id: true, firstName: true, lastName: true } },
        shelter: { select: { id: true, name: true } },
        animal: { select: { id: true, name: true } },
      }
    });

    if (updatedRequest && status === RequestStatus.accepted) {
      try {

        await prisma.animal.update({
          where: { id: updatedRequest.animalId },
          data: {
            status: AnimalStatus.fostered,
            Foster: {
              connect: {
                id: updatedRequest.fosterId
              }
            }
          }
        })

      } catch (error: any) {
        throw new Error(error)
      }
    }

    response.status(200).json({
      success: true,
      message: 'Request successfully updated',
      data: updatedRequest
    });
    return;


  } catch (error: any) {
    console.error(`Server error updating request ${id}:`, error);

    response.status(500).json({
      success: false,
      message: 'Server error while updating request',
      error: error.message,
    });
    return;
  }
}

export async function deleteRequest(
  request: ExpressRequest,
  response: ExpressResponse
): Promise<void> {
  const paramValidation = paramIdSchema.safeParse(request.params);
  if (!paramValidation.success) {
    response.status(400).json({
      success: false,
      message: 'Invalid Request ID format',
      error: paramValidation.error.format(),
    });
    return;
  }
  const { id } = paramValidation.data;

  try {
    await prisma.request.delete({ where: { id } });

    response.status(200).json({
      success: true,
      message: 'Request successfully deleted',
    });
    return;

  } catch (error: any) {
    console.error(`Server error deleting request ${id}:`, error);

    response.status(500).json({
      success: false,
      message: 'Server error while deleting request',
      error: error.message,
    });
    return;
  }
}