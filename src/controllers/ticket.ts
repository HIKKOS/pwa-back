import { Request, Response } from "express";
import IController from "../interfaces/controller";
import prisma from "../services/prisma_client";
import { Ticket } from "../@types/ticket";

const select = {
  folio: true,
  userId: true,
  total: true,
  createdAt: true,
  status: false,
  user: false,
  products: true,
};

class TicketController implements IController {
  static #intance: TicketController;

  /**
   *
   */
  constructor() {}

  public static getInstance(): TicketController {
    if (!TicketController.#intance) {
      TicketController.#intance = new TicketController();
    }

    return TicketController.#intance;
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    const { limit = "5", page = "1" } = req.query;

    try {
      const ticket: Ticket[] = await prisma.tickets.findMany({
        where: { status: true },
        skip: Number(page) - 1,
        take: Number(limit),
        select,
      });

      const count: number = await prisma.tickets.count({
        where: { status: true },
      });

      return res.json({ count, ticket });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ code: 500, msg: error });
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);

    const ticket = await prisma.tickets.findUnique({
      where: {
        folio: id,
      },
      select,
    });

    return res.json(ticket);
  }

  public async post(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      const newTicket: Ticket = await prisma.tickets.create({
        data: {
          userId: body.userId,
          total: body.total,
          createdAt: body.createAt,
          status: body.status,
        },
      });

      return res.status(200).json({
        msg: `se creo el ticket con folio ${newTicket.folio}`,
      });
    } catch (error) {
      return res.status(500).json({ code: 500, msg: error });
    }
  }

  public async put(req: Request, res: Response): Promise<Response> {
    try {
      const { params, body } = req;
      const oldTicket = await prisma.tickets.findUnique({
        where: { folio: parseInt(params.id) },
      });

      const newTicket = await prisma.tickets.update({
        where: {
          folio: parseInt(params.id),
        },
        data: {
          userId: body.userId || oldTicket!.userId,
          total: body.total || oldTicket!.total,
          createdAt: body.createdAt || oldTicket!.createdAt,
          status: body.status || oldTicket!.status,
        },
      });
      return res.status(204).json({
        msg: `Se actualizo el ticket con folio ${newTicket.folio}`,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        msg: error,
      });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await prisma.tickets.delete({
        where: {
          folio: parseInt(id),
        },
      });

      return res.status(204).json({
        msg: `Se elimino el ticket con folio ${id}`,
      });
    } catch (error: any) {
      return res.status(500).json({
        code: 500,
        msg: error,
      });
    }
  }
}

export default TicketController.getInstance();
