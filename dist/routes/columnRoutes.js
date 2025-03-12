"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const columnController_1 = require("../controllers/columnController");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, columnController_1.getColumns)(req, res);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, columnController_1.getColumnById)(req, res);
}));
router.put("/order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, columnController_1.updateColumnOrder)(req, res);
}));
exports.default = router;
