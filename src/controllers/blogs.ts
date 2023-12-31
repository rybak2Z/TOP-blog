import express from "express";
import commentsRouter from "./blogs/comments";

const router = express.Router();
router.use("/:blogId/comments", commentsRouter);

router.get("/", (_req, _res, next) => {
  //todo
  next();
});

router.post("/", (_req, _res, next) => {
  //todo
  next();
});

router.get("/:blogId", (_req, _res, next) => {
  //todo
  next();
});

router.put("/:blogId", (_req, _res, next) => {
  //todo
  next();
});

router.delete("/:blogId", (_req, _res, next) => {
  //todo
  next();
});

export default router;
