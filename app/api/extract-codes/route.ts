import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const CONFIG = {
  RATE_LIMIT_PER_USER: 10,
  RATE_LIMIT_INTERVAL: 60 * 30, // 30 minutes
} as const;

const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: CONFIG.RATE_LIMIT_PER_USER,
  duration: CONFIG.RATE_LIMIT_INTERVAL,
  keyPrefix: "rateLimiter",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ReplaySchema = z.object({
  replays: z.array(
    z.object({
      code: z.string().regex(/^[A-Z0-9]{5,12}$/i),
      map_name: z.string(),
      map_mode: z.string(),
      game_mode: z.string(),
      result: z.enum(["Victory", "Defeat", "Draw"]),
      score: z.string().regex(/^\d+-\d+$/),
    })
  ),
});

const SYSTEM_PROMPT = `
You are an AI specialized in extracting Overwatch 2 match replay information from screenshots of the game's replay menu. Analyze the provided image and output the following JSON structure exactly as shown (no extra fields or formatting):

\`\`\`json
{
  "replays": [
    {
      "code": "REPLAY_CODE",
      "map_name": "MAP_NAME",
      "map_mode": "MAP_GAME_MODE",
      "game_mode": "MATCH_GAME_MODE",
      "result": "Victory/Defeat/Draw",
      "score": "MATCH_SCORE"
    }
  ]
}
\`\`\`

### **Rules and Requirements**:

1. **Replay Code**:  
   - Extract replay codes consisting of uppercase letters and/or numbers, formatted as they appear in the screenshot (e.g., "SDQDOC").
   - Each code must exactly match the length and character set displayed in the screenshot (do not guess or infer).
   - If a valid replay code cannot be extracted, do not include an entry in the output.

2. **Map Name**:  
   - Extract the map name exactly as displayed in the screenshot.
   - Preserve capitalization and spacing as shown in-game. (e.g., "ILIOS" should remain "ILIOS", "KING'S ROW" should remain "KING'S ROW").
   - Do not alter or normalize the map name. If the map is shown as "HANOKA", output "HANOKA" exactly.

3. **Map Mode**:  
   - Extract the specific map mode (e.g., "Control", "Push", "Hybrid") as displayed or as can be clearly inferred from the screenshot’s textual elements.
   - If it is not explicitly stated, use the best known association for that map. For example, if the map is known in Overwatch 2 as a Control map, output "Control".

4. **Result**:  
   - Recognize and output one of exactly three values: "Victory", "Defeat", or "Draw".
   - These must match the exact wording (case-sensitive).

5. **Score**:  
   - Extract the score in the format displayed, typically "X-Y" where X and Y are integers.
   - Do not alter the numbers or formatting. If the screenshot shows "1-2", output "1-2" exactly.

6. **Game Mode**:  
   - The "game_mode" field should reflect the broader match type.
   - If the screenshot suggests it's from a custom game, label the "game_mode" as "Custom Game".
   - If another official game mode (e.g., Quick Play, Competitive) is clearly indicated, use that exact name. Otherwise, default to "Custom Game".

7. **Validation**:  
   - Only include entries where all of the following data is successfully extracted:
     - Valid replay code
     - Map name
     - Map mode
     - Game mode
     - Result
     - Score
   - If any of these pieces of information is incomplete or cannot be extracted, do not include that replay entry.

8. **Output Structure**:  
   - Return a JSON object with a "replays" array.
   - Each valid replay should be an object containing exactly the keys "code", "map_name", "map_mode", "game_mode", "result", and "score".
   - Do not add extra fields or alter the keys' names.
   - If no valid replays are found, return an empty array for "replays" (e.g. {"replays": []}).

9. **Irrelevant Data**:  
   - Ignore any text or graphical elements not related to replay details.
   - Do not make assumptions about data not visible in the screenshot.

### **Examples**:

**If valid entries are found:**

\`\`\`json
{
  "replays": [
    {
      "code": "SDQDOC",
      "map_name": "ILIOS",
      "map_mode": "Control",
      "game_mode": "Custom Game",
      "result": "Defeat",
      "score": "1-2"
    },
    {
      "code": "6HRS1Q",
      "map_name": "HANOKA",
      "map_mode": "Push",
      "game_mode": "Custom Game",
      "result": "Victory",
      "score": "5-3"
    },
    {
      "code": "S1B7YR",
      "map_name": "KING'S ROW",
      "map_mode": "Hybrid",
      "game_mode": "Custom Game",
      "result": "Draw",
      "score": "3-3"
    }
  ]
}
\`\`\`

**If no valid entries are found:**

\`\`\`json
{
  "replays": []
}
\`\`\`
`;

export async function POST(request: Request) {
  console.time("Request");
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

    // Rate Limiting using Redis
    const rateLimitKey = `rl:${user.id}`;
    try {
      await rateLimiter.consume(rateLimitKey, 1); // Consume 1 point
    } catch (rlRejected: any) {
      if (rlRejected instanceof Error) {
        throw rlRejected;
      } else {
        return NextResponse.json(
          {
            error:
              "Rate limit exceeded for your account. Please try again later.",
          },
          {
            status: 429,
            headers: {
              "Retry-After":
                String(Math.round(rlRejected.msBeforeNext / 1000)) || "60",
            },
          }
        );
      }
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing URL" },
        { status: 400 }
      );
    }

    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: [
            {
              text: SYSTEM_PROMPT,
              type: "text",
            },
          ],
        },
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
      response_format: {
        type: "json_object",
      },
      temperature: 0,
      max_completion_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const responseContent = openAIResponse.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No content in OpenAI response");
    }

    const parsedResponse = JSON.parse(responseContent);
    const validatedData = ReplaySchema.parse(parsedResponse);

    const replayData = validatedData.replays.map((replay) => ({
      ...replay,
      uploaded_by: user.id,
      uploaded_image_url: url,
    }));

    console.log("Replay data:", replayData);
    console.timeEnd("Request");

    const { error: insertError } = await supabase
      .from("replays")
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
