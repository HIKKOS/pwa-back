import { Request, Response } from "express";
import { validateJWT } from "../services/jwt";
import bycryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

const verifyAdminRole = (req: Request, res: Response, next: Function) => {
  const token = req.header("x-token");
  const payload = validateJWT(token!) as JwtPayload;
  if (bycryptjs.compareSync(payload.role, "ADMIN")) {
    return res.status(400).json({
      msg: "se quiere verificar el rol sin validar token",
    });
  }

  if (role !== "ADMIN_ROLE")
    return res.status(401).json({
      msg: `${name} no es administrador - no perimitido`,
    });

  next();
};
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userAuth) {
      return res.status(500).json({
        msg: "se quiere verificar el rol sin validar token",
      });
    }
    if (!roles.includes(req.userAuth.role)) {
      return res.status(500).json({
        msg: `tienes el rol: ${req.userAuth.role} se requiere uno de estos roles para este servicio: ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  verifyAdminRole,
  hasRole,
};
