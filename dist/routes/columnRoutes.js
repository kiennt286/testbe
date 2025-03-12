"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const columnController_1 = require("../controllers/columnController");
const router = express_1.default.Router();
router.get("/", columnController_1.getColumns);
router.get("/:id", columnController_1.getColumnById);
router.put("/order", columnController_1.updateColumnOrder);
exports.default = router;
