import { WebServiceClient } from "@maxmind/geoip2-node";
import { APP_CONFIG_PRIVATE } from "@/config/config.private";

// Type definitions
interface GeoLocation {
  city: string;
  subdivision: string;
  country: string;
}

enum DeviceType {
  Mobile = "Mobile",
  Tablet = "Tablet",
  Desktop = "Desktop",
}

// Constants
const UNKNOWN = "Unknown" as const;

const DEVICE_PATTERNS = {
  MOBILE: /android|webos|iphone|ipod|blackberry|windows phone/i,
  TABLET: /tablet|ipad|kindle/i,
} as const;

let geoipClient: WebServiceClient | null = null;

/**
 * Creates or returns a cached MaxMind client instance.
 */
function getGeoIpClient(): WebServiceClient {
  if (geoipClient) return geoipClient;

  geoipClient = new WebServiceClient(
    APP_CONFIG_PRIVATE.MAXMIND_CLIENT_ID,
    APP_CONFIG_PRIVATE.MAXMIND_LICENSE_KEY,
    {
      host: "geolite.info",
    }
  );

  return geoipClient;
}

/**
 * Cleans and validates a user agent string.
 */
export function cleanUserAgent(userAgent?: string | null): string {
  return userAgent?.trim() || UNKNOWN;
}

/**
 * Cleans, validates, and returns a sanitized IP address.
 */
export function cleanIpAddress(rawIp?: string | null): string {
  if (!rawIp) return UNKNOWN;

  const ip = rawIp
    .split(",")[0]
    .trim()
    .replace(/^::ffff:/, "");
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})(\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})){3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip) ? ip : UNKNOWN;
}

/**
 * Determines the device type from the user agent string.
 */
export function getDeviceType(userAgent: string): DeviceType {
  const normalizedUserAgent = userAgent.toLowerCase();

  if (DEVICE_PATTERNS.TABLET.test(normalizedUserAgent)) {
    return DeviceType.Tablet;
  }
  if (DEVICE_PATTERNS.MOBILE.test(normalizedUserAgent)) {
    return DeviceType.Mobile;
  }
  return DeviceType.Desktop;
}

/**
 * Fetches geographical location for the given IP address.
 */
export async function getLocationFromIp(ip: string): Promise<GeoLocation> {
  if (ip === UNKNOWN) {
    return { city: UNKNOWN, subdivision: UNKNOWN, country: UNKNOWN };
  }

  try {
    const client = getGeoIpClient();
    const response = await client.city(ip);

    return {
      city: response.city?.names?.en || UNKNOWN,
      subdivision: response.subdivisions?.at(-1)?.names?.en || UNKNOWN,
      country: response.country?.names?.en || UNKNOWN,
    };
  } catch (error) {
    console.error(`GeoIP lookup failed for IP ${ip}:`, error);
    return { city: UNKNOWN, subdivision: UNKNOWN, country: UNKNOWN };
  }
}
