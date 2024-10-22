import Express from "express";
import categoryController from "../controllers/categories";
import { check } from "express-validator";
import { validateFields, validatePagination } from "../middlewares/index";
import { existCategory } from "../utils/dbValidator";

const router = Express.Router();
router.get(
  "/",
  [validatePagination, validateFields],
  categoryController.getAll
);

router.get(
  "/:id",
  [check("id").custom(existCategory), validateFields],
  categoryController.get
);

router.post(
  "/",
  [check("categoryName", "no debe ser vacío").notEmpty(), validateFields],
  categoryController.post
);
router.put(
  "/:id",
  [
    check("id").custom(existCategory),
    check("categoryName").notEmpty(),
    validateFields,
  ],
  categoryController.put
);
router.delete(
  "/:id",
  [check("id").custom(existCategory)],
  categoryController.delete
);

module.exports = router;
