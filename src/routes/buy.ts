import Express from "express";
import buyController from "../controllers/buy";
import { validateCompra, validateFields } from "../middlewares";

const router = Express.Router();

//unique endpoint for buy
router.post('/',
    [validateFields,validateCompra],
    buyController.post
)

module.exports = router;