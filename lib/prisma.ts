import { APP_CONFIG_PRIVATE } from "@/config/config.private";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (APP_CONFIG_PRIVATE.APP_PROD) globalThis.prismaGlobal = prisma;
