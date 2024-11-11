import { pool } from "../helper/db.js";
import { Router } from "express";
import { emptyOrRows } from "../helper/utils.js";
import { auth } from "../helper/auth.js";
import { getTasks, postTask } from "../controllers/taskController.js";

const router = Router();

router.get("/", getTasks);

router.post("/create", postTask);

router.delete("/delete/:id", auth, (req, res, next) => {
  const id = parseInt(req.params.id);
  pool.query("DELETE FROM task where id = $1", [id], (error, result) => {
    if (error) {
      return next(error);
    }
    return res.status(200).json({ id: id });
  });
});
export default router;