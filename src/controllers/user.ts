import { Request, Response } from "express";
import Encrypter from "../utils/bycript";
import prisma from "../services/prisma_client";
import IController from "../interfaces/controller";
import User from "../@types/user";
const select = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  rolId: false,
  userPassword: false,
};

class UserController implements IController {
  static #instance: UserController;
  private constructor() {}
  public static getInstance(): UserController {
    if (!UserController.#instance) {
      UserController.#instance = new UserController();
    }
    return UserController.#instance;
  }

  public async post(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const newUser: User = await prisma.users.create({
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          userPassword: Encrypter.encryptPassword(body.userPassword),
          phone: body.phone,
        },
      });
      return res.json({
        msg: `Se creo el usuario ${newUser.firstName} con id ${newUser.id}`,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async get(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);

    const user: User | null = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select,
    });

    return res.json(user);
  }
  public async getAll(req: Request, res: Response): Promise<Response> {
    const { limit = "5", page = "1" } = req.query;
    try {
      const users: User[] = await prisma.users.findMany({
        where: { status: true },
        skip: Number(page) - 1,
        take: Number(limit),
        select,
      });
      const count: number = await prisma.users.count({
        where: { status: true },
      });
      return res.json({ count, users });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async put(req: Request, res: Response): Promise<Response> {
    try {
      const { params, body } = req;
      const oldUser: User | null = await prisma.users.findUnique({
        where: { id: parseInt(params.id) },
        include: { role: true },
      });
      const newUser: User = await prisma.users.update({
        where: {
          id: parseInt(params.id),
        },
        include: { role: true },
        data: {
          email: body.email || oldUser!.email,
          firstName: body.firstName || oldUser!.firstName,
          lastName: body.lastName || oldUser!.lastName,
          userPassword: body.password || oldUser!.userPassword,
          phone: body.phone || oldUser!.phone,
        },
      });
      return res.json({
        msg: `Se actualizo el usuario con id ${newUser.id}`,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await prisma.users.update({
        where: { id: parseInt(id) },
        data: {
          status: false,
        },
      });
      return res.json({
        msg: `Se elimino el usuario con id ${id}`,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async changeRol(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { roleId } = req.body;

      await prisma.users.update({
        where: { id: parseInt(id) },
        data: {
          rolId: parseInt(roleId),
        },
      });
      return res.json({
        msg: `Se cambio el rol de usuario con id ${id}`,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async getRoles(req: Request, res: Response): Promise<Response> {
    try {
      const { limit = "5", page = "1" } = req.query;
      const roles = await prisma.roles.findMany({
        skip: Number(page) - 1,
        take: Number(limit),
      });
      const count = await prisma.roles.count();
      return res.json({ count, roles });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
}
export default UserController.getInstance();
