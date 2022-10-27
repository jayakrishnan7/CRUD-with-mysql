import express from "express";

// import execQuery from "../config/db";

import {
  createPerson,
  deletePerson,
  searchUsers,
  exportUsers,
  allUsers,
  updateUser,
  uploadFiles,
} from "../controllers/users";

const router = express.Router();

router.post("/register", createPerson);


router.put("/updateUser/:id", updateUser);
// router.put("/updateUser/:id", updateUser);

router.delete("/delete/:id", deletePerson);

router.post("/search", searchUsers);

router.get("/downloadExcel", exportUsers);

router.post("/upload_files", uploadFiles);

router.get("/", allUsers);

export { router };
