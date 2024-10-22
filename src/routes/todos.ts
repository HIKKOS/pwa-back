import Express from "express";
import TodoController from "../controllers/todos";

const router = Express.Router();

router.get("/", TodoController.getAll);

router.post(
  "/",

  TodoController.post
);
router.put(
  "/:id",

  TodoController.put
);
router.delete(
  "/:id",

  TodoController.delete
);

module.exports = router;
