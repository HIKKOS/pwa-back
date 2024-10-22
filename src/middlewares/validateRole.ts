import { Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import { Roles } from "../utils/enums";

export async function validateUserRole(
  req: Request,
  res: Response,
  next: Function
): Promise<Response | Function> {
  const token = req.header("x-token") as string;
  const { role } = jwt.verify(
    token,
    process.env.SECRETORPRIVATEKEY!
  ) as JwtPayload;
  if (!compareSync(Roles.user, role)) {
    return res.status(400).json({
      msg: "no tienes permisos",
    });
  }
  return next();
}
export async function validateAdminRole(
  req: Request,
  res: Response,
  next: Function
): Promise<Response | Function> {
  const token = req.header("x-token") as string;
  if (!token) {
    return res.status(400).json({ msg: "no se mando token" });
  }
  const { role } = jwt.verify(
    token,
    process.env.SECRETORPRIVATEKEY!
  ) as JwtPayload;

  if (!compareSync(Roles.admin, role)) {
    return res.status(401).json({
      msg: "no tienes permisos",
    });
  }
  return next();
}
