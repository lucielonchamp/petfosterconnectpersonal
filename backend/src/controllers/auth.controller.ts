import { Request, Response } from "express";
import { loginShema, registerSchema } from "../schemas/auth.schema";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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

export const login = async (req: Request, res: Response): Promise<any> => {

	const requestedData = req.body;

	const { success, error } = loginShema.safeParse(requestedData);

	if (!success) {
		return res.status(400).json({
			success: false,
			message: 'Invalid data',
			error: error
		})
	}

	try {

		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ success: false, message: 'Email and password required' });
			return;
		}

		const user = await prisma.user.findUnique({
			where: { email }
		});

		if (!user) {
			res.status(400).json({ success: false, message: 'Email does not exists' });
			return;
		}

		const passwordCheck = await bcrypt.compare(password, user.password);

		if (!passwordCheck) {
			res.status(400).json({ success: false, message: 'Incorrect password' });
			return;
		}

		const token = jwt.sign({
			userRoleId: user.roleId,
			email: user.email
		}, process.env.JWT_SECRET!);

		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax' as const,
			maxAge: 60 * 60 * 1000
		};

		res.cookie('authToken', token, cookieOptions);

		res.status(200).json({
			success: true,
			message: 'Connexion réussie 😄!',
			token

		});
	} catch (error) {
		res.status(500).json({ success: false, message: 'Server error' });
	}
};