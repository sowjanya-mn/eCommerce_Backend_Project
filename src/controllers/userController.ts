import type { RequestHandler } from "express";
import { User } from "#models";
//import type { UserType } from "#types";
import { userInputSchema } from "#schemas";
import { z } from "zod";
import type { Types } from "mongoose";

type UserInputDTO = z.infer<typeof userInputSchema>;
type UserOutputDTO = UserInputDTO & {
  _id: InstanceType<typeof Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
};
type IDParams = {
  id: string;
};

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Get all users
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Users fetched Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */
export const getUsers: RequestHandler<
  unknown,
  UserOutputDTO[] | { error: string }
> = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users as UserOutputDTO[]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Create a new user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *     responses:
 *      201:
 *        description: User created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */
export const createUser: RequestHandler<
  unknown,
  UserOutputDTO | { error: string },
  UserInputDTO
> = async (req, res) => {
  try {
    const newUser = await User.create(req.body satisfies UserInputDTO);
    res.status(201).json(newUser as UserOutputDTO);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     parameters: [
 *      {
 *        in: 'path',
 *        name: 'id',
 *        required: true,
 *        schema: {
 *        type: 'string'
 *        }
 *      }
 *     ]
 *
 *     description: Get a user by id
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: User fetched Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

export const getUserById: RequestHandler<
  IDParams,
  UserOutputDTO | { error: string }
> = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     parameters: [
 *      {
 *        in: 'path',
 *        name: 'id',
 *        required: true,
 *        schema: {
 *        type: 'string'
 *        }
 *      }
 *     ]
 *     description: Update existing user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *     responses:
 *      201:
 *        description: User updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

export const updateUser: RequestHandler<
  IDParams,
  UserOutputDTO | { error: string },
  UserInputDTO
> = async (req, res) => {
  try {
    const {
      body,
      params: { id },
    } = req;
    const { name, email } = body;
    if (!name || !email)
      return res.status(400).json({ error: "name and email are required" });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.name = name;
    user.email = email;
    await user.save();

    res.json(user as UserOutputDTO);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     parameters: [
 *      {
 *        in: 'path',
 *        name: 'id',
 *        required: true,
 *        schema: {
 *        type: 'string'
 *        }
 *      }
 *     ]
 *
 *     description: Delete a user by id
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: User deleted Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

export const deleteUser: RequestHandler<
  IDParams,
  { message: string } | { error: string }
> = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
