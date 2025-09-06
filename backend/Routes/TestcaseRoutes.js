import express from "express";

import protect from "../Middlewares/protected.js";

import { createTestCase, deleteTestCase, updateTestCase, getTestCase } from "../Controllers/TestcaseController.js";

const route = express.Router();

route.post("/:fileId", protect, createTestCase);

route.put("/:testCaseId", protect, updateTestCase);

route.get("/:testCaseId", protect, getTestCase);

route.delete("/:fileId/:testCaseId", protect, deleteTestCase);


export default route;