import OpenAI from "openai";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { RateLimiter } from "limiter";
import { getMapIdByName } from "@/utils/maps";
import { User } from "@supabase/supabase-js";

const CONFIG = {
  RATE_LIMIT_PER_USER: 1,
  MAX_FILE_SIZE_MB: 10,
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
} as const;

const userLimiters = new Map<string, RateLimiter>();
const userLastAccess = new Map<string, number>();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ReplaySchema = z.object({
  replays: z.array(
    z.object({
      code: z.string().regex(/^[A-Z0-9]{5,12}$/i),
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

async function uploadFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User,
  file: File
): Promise<string> {
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

// Function to get or create a rate limiter for a specific user ID
function getUserLimiter(userId: string): RateLimiter {
  if (!userLimiters.has(userId)) {
    userLimiters.set(
      userId,
      new RateLimiter({
        tokensPerInterval: CONFIG.RATE_LIMIT_PER_USER,
        interval: "minute",
        fireImmediately: true,
      })
    );
  }
  userLastAccess.set(userId, Date.now());
  return userLimiters.get(userId)!;
}

// Clean up old user limiters every hour
setInterval(() => {
  try {
    const oneHourAgo = Date.now() - CONFIG.CLEANUP_INTERVAL;
    Array.from(userLastAccess.entries()).forEach(([userId, lastAccess]) => {
      if (lastAccess < oneHourAgo) {
        userLimiters.delete(userId);
        userLastAccess.delete(userId);
      }
    });
  } catch (error) {
    console.error("Cleanup error:", error);
  }
}, CONFIG.CLEANUP_INTERVAL);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to use this service" },
        { status: 401 }
      );
    }

    // Check user-specific rate limit
    const userLimiter = getUserLimiter(user.id);
    const userRateLimit = await userLimiter.removeTokens(1);
    if (userRateLimit < 0) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded for your account. Please try again later.",
        },
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

    const url = await uploadFile(supabase, user, file);

    // Process with OpenAI
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: [{ type: "image_url", image_url: { url } }] },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 2048,
    });

    const responseContent = openAIResponse.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No content in OpenAI response");
    }

    const parsedResponse = JSON.parse(responseContent);
    const validatedData = ReplaySchema.parse(parsedResponse);

    const replayData = await Promise.all(
      validatedData.replays.map(async (replay) => ({
        code: replay.code.toUpperCase(),
        map_id: await getMapIdByName(supabase, replay.map),
        result: replay.result,
        uploaded_by: user.id,
        uploaded_image_url: url,
      }))
    );

    const { error: insertError } = await supabase
      .from("replay_codes")
      .insert(replayData);

    if (insertError) {
      throw new Error("Failed to store replay codes");
    }

    return NextResponse.json(validatedData);
  } catch (error: any) {
    console.error("Process error:", error);
    const errorMessage = error.message || "Failed to process image";
    const statusCode = error.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
