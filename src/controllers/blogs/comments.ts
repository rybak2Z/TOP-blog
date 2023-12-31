import express from "express";

const router = express.Router();

router.get("/", (_req, _res, next) => {
  //todo
  next();
});

router.post("/", (_req, _res, next) => {
  //todo
  next();
});

router.delete("/:commentId", (_req, _res, next) => {
  //todo
  next();
});

export default router;
