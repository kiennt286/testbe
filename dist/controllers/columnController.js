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
exports.updateColumnOrder = exports.getColumnById = exports.getColumns = void 0;
const drizzle_1 = require("../db/drizzle");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getColumns = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allColumns = yield drizzle_1.db.select().from(schema_1.columns).orderBy(schema_1.columns.order);
        if (allColumns.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "No columns found" });
        }
        res.status(200).json({ success: true, data: allColumns, message: "Columns retrieved successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.getColumns = getColumns;
const getColumnById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const columnId = Number(id);
        if (isNaN(columnId) || columnId <= 0) {
            return res.status(400).json({ success: false, error: "Invalid column ID" });
        }
        const [column] = yield drizzle_1.db.select().from(schema_1.columns).where((0, drizzle_orm_1.eq)(schema_1.columns.id, columnId));
        if (!column) {
            return res.status(404).json({ success: false, error: "Column not found" });
        }
        res.status(200).json({ success: true, data: column, message: "Column retrieved successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.getColumnById = getColumnById;
const updateColumnOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { columns: updatedColumns } = req.body;
        if (!Array.isArray(updatedColumns) || updatedColumns.length !== 3) {
            return res.status(400).json({ success: false, error: "Exactly 3 columns are required" });
        }
        yield drizzle_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            for (const col of updatedColumns) {
                if (!col.id || col.order === undefined || typeof col.order !== "number") {
                    throw new Error("Each column must have a valid id and order (number)");
                }
                const [existingColumn] = yield tx.select().from(schema_1.columns).where((0, drizzle_orm_1.eq)(schema_1.columns.id, col.id));
                if (!existingColumn) {
                    throw new Error(`Column with id ${col.id} not found`);
                }
                yield tx.update(schema_1.columns).set({ order: col.order }).where((0, drizzle_orm_1.eq)(schema_1.columns.id, col.id));
            }
        }));
        const updatedData = yield drizzle_1.db.select().from(schema_1.columns).orderBy(schema_1.columns.order);
        res.status(200).json({ success: true, data: updatedData, message: "Column order updated" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.updateColumnOrder = updateColumnOrder;
