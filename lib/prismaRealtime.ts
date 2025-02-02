import { APP_CONFIG_PRIVATE } from "@/config/config.private";
import { PrismaClient } from "@prisma/client/edge";
import { withPulse } from "@prisma/extension-pulse/node";

const prismaRealtimeClientSingleton = () => {
  return new PrismaClient().$extends(
    withPulse({
      apiKey: APP_CONFIG_PRIVATE.PULSE_API_KEY,
    }),
  );
};

declare global {
  var prismaRealtimeGlobal: ReturnType<typeof prismaRealtimeClientSingleton>;
}

const prismaRealtime =
  globalThis.prismaRealtimeGlobal ?? prismaRealtimeClientSingleton();

export default prismaRealtime;

if (APP_CONFIG_PRIVATE.APP_PROD)
  globalThis.prismaRealtimeGlobal = prismaRealtime;
