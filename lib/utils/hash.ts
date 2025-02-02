/**
 * Returns a hex-encoded SHA-256 hash of the given string value.
 *
 * @param value - The input string to hash.
 * @returns A promise that resolves to the hex-encoded SHA-256 hash.
 */
export async function sha256Hash(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert ArrayBuffer to hex string using more concise iteration
  return Array.from(new Uint8Array(hashBuffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

/**
 * Generates cryptographically secure random bytes and returns them as a hex string.
 *
 * @param byteLength - The number of random bytes to generate (default is 32).
 * @returns A hex-encoded string of random bytes.
 */
export function randomHex(byteLength = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));

  // Efficiently convert bytes to hex string
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
