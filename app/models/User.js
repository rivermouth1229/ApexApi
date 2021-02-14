const { prisma } = require('./prisma/PrismaClient')
exports.User = prisma.user;
