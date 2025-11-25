"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueID = void 0;
const prisma_1 = require("../prisma");
const generateUniqueID = async () => {
    const rows = await prisma_1.prisma.$queryRaw `
    SELECT COALESCE(MAX(CAST(REPLACE("uniqueID",'#','') AS INT)), 1009) AS max FROM "User"
  `;
    const next = (rows[0]?.max ?? 1009) + 1;
    return `#${next}`;
};
exports.generateUniqueID = generateUniqueID;
