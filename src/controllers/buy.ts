import { Prisma, ProductTicket } from "@prisma/client";
import prisma from "../services/prisma_client";
import { Response, Request } from "express";


class BuyController {

    static #instance : BuyController;

    constructor(){}

    public static getInstance(): BuyController{
        if(!BuyController.#instance){
            BuyController.#instance= new BuyController();
        }

        return BuyController.#instance;
    }

    public async post(req:Request, res: Response):Promise<Response>{
        try {
            await prisma.$transaction(async (ts)=>{
                
                const { userId, products } = req.body;

                let precioTotal: number= 0;

                for(const product of products){
                    const {amount, price, productId}= product;
                    console.log(amount)

                    precioTotal+=amount*price;

                    await BuyController.getInstance().discountAmount(productId, amount,ts);
                }

                await ts.tickets.create({
                    data:{
                        userId:userId,
                        createdAt: new Date(),
                        status:true,
                        products: {
                            createMany: {
                                data: products.map((product: ProductTicket) => ({
                                  productId: product.productId,
                                  productName: product.productName,
                                  amount: product.amount,
                                  price: product.price,
                                })),
                              },
                        },
                        total: precioTotal

                    }
                })
            });
            return res.status(200).json({
                code: 200,
                msg: 'Solicitud procesada correctamente.',
              });
        } catch (error:any) {
            return res.status(500).json({
                code: 500,
                msg: error.message || 'Ha ocurrido un error interno.',
              });
        }
    }

    public async discountAmount(productId: number, cantidad: number, ts: Prisma.TransactionClient){
        try {
            const product: any = await prisma.products.findUnique({
                where: {
                    id: productId,
                },
            });
            
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            const {stock}= product;

            if(stock ==0 || cantidad > stock){
                throw new Error(`product ${productId} no disponible`);
            }
    
            const newStock = stock - cantidad;
    
            await ts.products.update({
                where: {
                    id: productId,
                },
                data: {
                    stock: newStock
                }
            });
        } catch (error) {
        
            throw error;
        }
    }


}

export default BuyController.getInstance();