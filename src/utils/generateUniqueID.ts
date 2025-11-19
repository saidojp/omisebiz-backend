import { prisma } from "../prisma";

export const generateUniqueID = async (): Promise<string> => {
  const rows = await prisma.$queryRaw<{ max: number }[]>`
    SELECT COALESCE(MAX(CAST(REPLACE("uniqueID",'#','') AS INT)), 1009) AS max FROM "User"
  `;
  const next = (rows[0]?.max ?? 1009) + 1;
  return `#${next}`;
};
