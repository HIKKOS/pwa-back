import Express from "express";
import userController from "../controllers/user";
import { check } from "express-validator";
//import { validateJWT } from "../middlewares/validateJwt";
//import { validateAdminRole } from "../middlewares/validateRole";
import {
  validateFields,
  userRequiredFields,
  validatePagination,
} from "../middlewares/index";
import {
  existEmail,
  existPhone,
  existRoleId,
  existUserId,
} from "../utils/dbValidator";

const router = Express.Router();

router.get("/", [validatePagination, validateFields], userController.getAll);
router.get(
  "/roles",
  [validatePagination, validateFields],
  userController.getRoles
);

router.get(
  "/:id",
  [check("id").custom(existUserId), validateFields],
  userController.get
);

router.post(
  "/",
  [
    ...userRequiredFields,
    check("phone").custom(existPhone),
    check("email").custom(existEmail),
    validateFields,
  ],
  userController.post
);
router.put(
  "/:id",
  [check("id").custom(existUserId), validateFields],
  userController.put
);
router.delete(
  "/:id",
  [check("id").custom(existUserId), validateFields],
  userController.delete
);
router.put(
  "/change/:id",
  [
    //validateJWT,
    //validateFields,
    check("id").custom(existUserId),
    check("roleId").custom(existRoleId),
    //validateAdminRole,
    validateFields,
  ],
  userController.changeRol
);

module.exports = router;
