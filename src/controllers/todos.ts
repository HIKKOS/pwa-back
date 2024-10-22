import { Request, Response } from "express";
import prisma from "../services/prisma_client";
import IController from "../interfaces/controller";

class TodoController implements IController {
  static #instance: TodoController;
  private constructor() {}
  public static getInstance(): TodoController {
    if (!TodoController.#instance) {
      TodoController.#instance = new TodoController();
    }
    return TodoController.#instance;
  }

  public async post(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const todo = await prisma.todos.create({
        data: {
          description: body.description,
          title: body.title,
        },
      });
      return res.json(todo);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }

  public async getAll(_: Request, res: Response): Promise<Response> {
    try {
      const todos = await prisma.todos.findMany({
        where: {
          status: true,
        },
      });
      const count = await prisma.todos.count();
      return res.json({ count, todos });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async put(req: Request, res: Response): Promise<Response> {
    try {
      const { params, body } = req;
      const { id } = params;
      await prisma.todos.update({
        where: { id: parseInt(id) },
        data: {
          description: body.description,
          title: body.title,
        },
      });
      return res.json({
        msg: `Se actualizo el todo con id ${id}`,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await prisma.todos.update({
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
}
export default TodoController.getInstance();
