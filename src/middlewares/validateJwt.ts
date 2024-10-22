import { Response, Request } from "express";

import jwt from "jsonwebtoken";
export async function validateJWT(
  req: Request,
  res: Response,
  next: Function
): Promise<Response | Function> {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "no hay token en la peticion",
    });
  }
  try {
    jwt.verify(token, process.env.SECRETORPRIVATEKEY!);

    return next();
  } catch (error) {
    if (error === jwt.TokenExpiredError) {
      return res.status(401).json({
        msg: "expiro el JWT",
      });
    }
    if (error === jwt.JsonWebTokenError) {
      console.log(error);
    }
    return res.status(401).json({
      msg: "token no valido",
    });
  }
}
