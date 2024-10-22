import { Request, Response } from "express";

const validatePagination = (
  req: Request,
  res: Response,
  next: Function
): Response => {
  const { limit = "5", page = "1" } = req.query;
  const newLimit = Number(limit);
  const newPage = Number(page);
  if (isNaN(newLimit)) {
    throw res
      .status(400)
      .json({ msg: `limit esperaba un numero y obtuvo: ${limit}` });
  }
  if (isNaN(newPage)) {
    return res
      .status(400)
      .json({ msg: `page esperaba un numero y obtuvo: ${page}` });
  }
  req.query.limit = limit;
  req.query.page = page;
  return next();
};
export default validatePagination;
