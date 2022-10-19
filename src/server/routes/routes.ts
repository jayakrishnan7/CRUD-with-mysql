import express from "express";

// import execQuery from "../config/db";

import {
  createPerson,
  deletePerson,
  searchUsers,
  exportUsers,
  allUsers,
  updateUser,
} from "../controllers/users";

const router = express.Router();

router.post("/register", createPerson);

router.put("/updateUser/:id", updateUser);

router.delete("/delete/:id", deletePerson);

router.post("/search", searchUsers);

router.get("/downloadExcel", exportUsers);

router.get("/", allUsers);

export { router };
