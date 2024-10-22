import Express from "express";
import ticketController from "../controllers/ticket";
import { check } from "express-validator";
import { validateFields, validatePagination } from "../middlewares/index";
import { existTicket } from "../utils/dbValidator";



const router =  Express.Router();

router.get('/',
    [validatePagination,validateFields],
    ticketController.getAll
);

router.get('/:id',
    [check("id").custom(existTicket),validateFields],
    ticketController.get
);

router.post(
    '/',
    [
        validateFields
    ],
    ticketController.post
)

router.put(
    '/:id',
    [
        check("id").custom(existTicket),
        validateFields,
    ],
    ticketController.put
)


router.delete(
    '/:id',
    [
        check("id").custom(existTicket),
    ],
    ticketController.delete
)

module.exports = router;