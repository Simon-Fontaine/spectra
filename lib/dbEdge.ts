import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { APP_CONFIG_PRIVATE } from "@/lib/config.private";

const prismaEdgeClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare const globalThis: {
  prismaEdgeGlobal: ReturnType<typeof prismaEdgeClientSingleton>;
} & typeof global;

const prismaEdge = globalThis.prismaEdgeGlobal ?? prismaEdgeClientSingleton();

export default prismaEdge;

if (APP_CONFIG_PRIVATE.APP_PROD) globalThis.prismaEdgeGlobal = prismaEdge;
