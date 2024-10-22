import { Request, Response } from "express";

export default interface IController {
  getAll: (req: Request, res: Response) => Promise<any>;
  post: (req: Request, res: Response) => Promise<any>;

  put: (req: Request, res: Response) => Promise<any>;
  delete: (req: Request, res: Response) => Promise<any>;
}
