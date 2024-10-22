import { Request, Response } from "express";

import IController from "../interfaces/controller";
import { FileSystemDatasource } from "../utils/file-system.datasource";

const fileSystemDatasource = new FileSystemDatasource();
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

      const todo = await fileSystemDatasource.saveLogs({
        completed: false,

        id: new Date().getTime(),

        description: body.description,
        title: body.title,
      });
      return res.json(todo);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }

  public async getAll(_: Request, res: Response): Promise<Response> {
    try {
      const todos = await fileSystemDatasource.getLogs();
      /* const todos = await prisma.todos.findMany({
        where: {
          status: true,
        },
      }); */

      return res.json({ count: todos.length, todos });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async put(req: Request, res: Response): Promise<Response> {
    try {
      const { params, body } = req;
      const { id } = params;
      await fileSystemDatasource.updateLogById(parseInt(id), {
        completed: body.completed,
        description: body.description,
        id: parseInt(id),
        title: body.title,
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
      await fileSystemDatasource.deleteLogById(parseInt(id));
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
