const { PrismaClient } = require("@prisma/client");
exports.prisma = new PrismaClient({
  log: ["query"],
});
