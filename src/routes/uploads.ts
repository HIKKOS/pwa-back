import Express from "express";
import { check } from "express-validator";
import { createPhoto, getPhoto, deletePhoto } from "../controllers/uploads";
import { existEntity, existImage, existProduct } from "../utils/dbValidator";
import { Entities } from "../utils/enums";
import { validateFields } from "../middlewares";

const router = Express.Router();
router.post(
  "/products/:id",
  [
    check("id").custom((id) => existEntity(id, Entities.products)),
    validateFields,
  ],
  createPhoto
);
router.get(
  "/:itemName/:id/:photoName",
  [
    check("itemName").isIn(["products"]),
    check("photoName", "no debe ser vacio").notEmpty(),
    check("id").custom((id) => existEntity(id, Entities.products)),
    validateFields,
  ],
  getPhoto
);
router.delete(
  "/:itemName/:productId/:photoName",
  [
    check("itemName").isIn(["products"]),
    check("photoName").custom(existImage),
    check("productId").custom(existProduct),

    validateFields,
  ],
  deletePhoto
);
module.exports = router;
