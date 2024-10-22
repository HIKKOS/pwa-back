import { Request, Response } from "express";
import prisma from "../services/prisma_client";
import IController from "../interfaces/controller";
import Category from "../@types/category";

class CategoryController implements IController {
  static #instance: CategoryController;
  private constructor() {}
  public static getInstance(): CategoryController {
    if (!CategoryController.#instance) {
      CategoryController.#instance = new CategoryController();
    }
    return CategoryController.#instance;
  }

  public async post(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      const newCategory: Category = await prisma.categories.create({
        data: {
          categoryName: body.categoryName,
        },
      });
      return res.json({
        msg: `Se creo la categoria ${newCategory.categoryName} con id ${newCategory.id}`,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async get(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);
    const category: Category | null = await prisma.categories.findUnique({
      where: {
        id: id,
      },
    });

    return res.json(category);
  }
  public async getAll(req: Request, res: Response): Promise<Response> {
    const { limit = "5", page = "1" } = req.query;
    const count = await prisma.categories.count({ where: { status: true } });
    const categories = await prisma.categories.findMany({
      where: { status: true },
      skip: Number(page) - 1,
      take: Number(limit),
    });
    return res.json({
      total: count,
      categories: categories,
    });
  }
  public async put(req: Request, res: Response): Promise<Response> {
    try {
      const { params, body } = req;
      console.log({ params, body });
      const oldCategory: Category | null = await prisma.categories.findUnique({
        where: { id: parseInt(params.id) },
      });
      const newCategory: Category = await prisma.categories.update({
        where: {
          id: parseInt(params.id),
        },
        data: {
          categoryName: body.categoryName || oldCategory?.categoryName,
        },
      });
      return res.json({
        msg: `Se actualizo la categoria con id ${newCategory.id}`,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await prisma.categories.update({
        where: { id: parseInt(id) },
        data: {
          status: false,
        },
      });
      return res.json({
        msg: `Se elimino la categoría con id ${id}`,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }
}
export default CategoryController.getInstance();
