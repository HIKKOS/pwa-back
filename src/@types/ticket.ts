import { Decimal } from "@prisma/client/runtime/library";
import User from "./user";
import { ProductsTicket } from "./productsTicket";

export interface Ticket{
    folio:number;
    userId:number;
    total:Decimal;
    createdAt:Date;
    status:boolean;
    user?:User | null;
    products?: ProductsTicket[];
    copyWith?(user: Ticket): Ticket;
}