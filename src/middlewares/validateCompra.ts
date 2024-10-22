import { NextFunction, Request, Response } from "express";

const validateCompra  = (req:Request, res:Response, next:Function): Response | NextFunction => {
    const { userId, products } = req.body;
    console.log("hola")
          // Validación de userId y products
        if (!userId || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            code: 400,
            msg: 'El formato de la solicitud es incorrecto.',
        });
        
    }
    return next();
}

export default validateCompra;