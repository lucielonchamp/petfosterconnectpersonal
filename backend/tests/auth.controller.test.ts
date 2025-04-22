import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import express, { Request, Response } from 'express';
import router from '../src/routes/router';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use('', router);

const prisma = new PrismaClient();

beforeAll(async () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('azerty123!', salt);

  const role = await prisma.role.findUnique({
    where: {
      name: 'admin',
    },
  });

  if (!role) {
    throw new Error('Admin role not found in the database');
  }

  const roleId = role.id;

  // Creates a test user
  await prisma.user.upsert({
    where: {
      email: 'testCaseAccount@example.com',
    },
    update: {
      password: hashedPassword,
      roleId: roleId,
    },
    create: {
      email: 'testCaseAccount@example.com',
      password: hashedPassword,
      role: {
        connect: {
          id: roleId,
        },
      },
    },
  });
});

afterAll(async () => {
  await prisma.user.delete({
    where: {
      email: 'testCaseAccount@example.com',
    },
  });

  await prisma.user.delete({
    where: {
      email: 'toto@toto.com',
    },
  });
});

describe('POST /login', () => {
  describe('with good credentials', () => {
    it('should return 200', async () => {
      const mockRequestedData = {
        email: 'testCaseAccount@example.com',
        password: 'azerty123!',
      };

      const response = await request(app).post('/auth/login').send(mockRequestedData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('with bad credentials', () => {
    it('should return 400', async () => {
      const mockRequestedData = {
        email: 'toto',
        password: 'toto',
      };

      const response = await request(app).post('/auth/login').send(mockRequestedData);

      expect(response.statusCode).toBe(400);
    });
  });
});

describe('POST /register', () => {
  describe('with good email, password and role', () => {
    it('should return 200', async () => {
      const mockRequestedData = {
        email: 'toto@toto.com',
        password: 'sJksoD8!)d',
        roleId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      };

      const response = await request(app).post('/auth/register').send(mockRequestedData);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('with bad email but good password and role', () => {
    it('should return 400', async () => {
      const mockRequestedData = {
        email: 'toto',
        password: 'sJksoD8!)d',
        roleId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      };

      const response = await request(app).post('/auth/register').send(mockRequestedData);
      expect(response.statusCode).toBe(400);
    });
  });
});
