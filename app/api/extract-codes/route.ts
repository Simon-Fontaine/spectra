import OpenAI from "openai";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { headers } from "next/headers";
import { RateLimiter } from "limiter";

const CONFIG = {
  RATE_LIMIT_GLOBAL: 5, // requests per minute
  RATE_LIMIT_PER_IP: 3, // requests per minute
  MAX_FILE_SIZE_MB: 10,
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
} as const;

const rateLimiter = new RateLimiter({
  tokensPerInterval: CONFIG.RATE_LIMIT_GLOBAL,
  interval: "minute",
  fireImmediately: true,
});

const ipLimiters = new Map<string, RateLimiter>();
const ipLastAccess = new Map<string, number>();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ReplaySchema = z.object({
  replays: z.array(
    z.object({
      code: z.string(),
      map: z.string(),
      result: z.enum(["Victory", "Defeat", "Draw"]),
    })
  ),
});

const SYSTEM_PROMPT = `
You are an AI specialized in extracting Overwatch 2 match replay codes from screenshots of the game's menu. 
Analyze the provided image URL and output the following JSON structure:

{
  "replays": [
    {
      "code": "REPLAY_CODE",
      "map": "MAP_NAME",
      "result": "Victory/Defeat/Draw"
    }
  ]
}

Rules:
1. Extract replay codes, map names, and results exactly as shown
2. Ensure map names match exactly as displayed in the game
3. Only include Victory, Defeat, or Draw as results
4. Return empty array if no valid replays found
5. Validate all codes follow the correct format (letters and numbers)
`;

async function uploadFile(file: File): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to upload files");
  }

  const filePath = `replays/${uuidv4()}`;

  const { data: uploadedData, error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error || !uploadedData) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file to storage");
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  if (!publicUrlData) {
    throw new Error("Failed to generate public URL");
  }

  return publicUrlData.publicUrl;
}

// Function to get or create a rate limiter for a specific IP
function getIpLimiter(ip: string): RateLimiter {
  if (!ipLimiters.has(ip)) {
    ipLimiters.set(
      ip,
      new RateLimiter({
        tokensPerInterval: CONFIG.RATE_LIMIT_PER_IP,
        interval: "minute",
        fireImmediately: true,
      })
    );
  }
  ipLastAccess.set(ip, Date.now());
  return ipLimiters.get(ip)!;
}

// Clean up old IP limiters every hour
setInterval(() => {
  try {
    const oneHourAgo = Date.now() - CONFIG.CLEANUP_INTERVAL;
    Array.from(ipLastAccess.entries()).forEach(([ip, lastAccess]) => {
      if (lastAccess < oneHourAgo) {
        ipLimiters.delete(ip);
        ipLastAccess.delete(ip);
      }
    });
  } catch (error) {
    console.error("Cleanup error:", error);
  }
}, CONFIG.CLEANUP_INTERVAL);

export async function POST(request: Request) {
  try {
    // Get client IP
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Check global rate limit
    const globalRateLimit = await rateLimiter.removeTokens(1);
    if (globalRateLimit < 0) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }

    // Check IP-specific rate limit
    const ipLimiter = getIpLimiter(clientIp);
    const ipRateLimit = await ipLimiter.removeTokens(1);
    if (ipRateLimit < 0) {
      return NextResponse.json(
        { error: "Rate limit exceeded for your IP. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    // Validate file
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image." },
        { status: 400 }
      );
    }

    if (file.size > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File size exceeds ${CONFIG.MAX_FILE_SIZE_MB}MB limit` },
        { status: 400 }
      );
    }

    // Upload file and get URL
    const url = await uploadFile(file);

    // Process with OpenAI
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: url,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 2048,
    });

    const responseContent = openAIResponse.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No content in OpenAI response");
    }

    // Parse and validate response
    try {
      const parsedResponse = JSON.parse(responseContent);
      const validatedData = ReplaySchema.parse(parsedResponse);

      return NextResponse.json(validatedData);
    } catch (parseError) {
      console.error("Response validation error:", parseError);
      throw new Error("Invalid response format from AI");
    }
  } catch (error: any) {
    console.error("Process error:", error);

    // Return appropriate error message based on error type
    const errorMessage = error.message || "Failed to process image";
    const statusCode = error.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
