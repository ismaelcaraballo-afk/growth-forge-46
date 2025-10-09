import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    // Generate prompts based on type
    if (type === "books") {
      systemPrompt = "You are a thoughtful book recommendation assistant. Analyze reading patterns and suggest books that match the user's interests and reading level.";
      userPrompt = `Based on this reading history: ${JSON.stringify(data)}
      
Provide 3 personalized book recommendations with:
1. Title and Author
2. Why it matches their interests (reference specific books they've read)
3. Estimated difficulty level

Also provide a brief insight about their reading patterns (genres they prefer, completion rate, etc.)`;
    } else if (type === "career") {
      systemPrompt = "You are a career coach analyzing job application patterns. Provide strategic advice.";
      userPrompt = `Based on these job applications: ${JSON.stringify(data)}
      
Provide:
1. Analysis of application patterns (industries, roles, success rate)
2. 3 specific actionable tips to improve job search
3. Suggested skills to highlight based on the positions they're targeting

Keep advice practical and encouraging.`;
    } else if (type === "vocabulary") {
      systemPrompt = "You are a language learning coach. Analyze vocabulary progress and suggest effective learning strategies.";
      userPrompt = `Based on this vocabulary data: ${JSON.stringify(data)}
      
Provide:
1. Analysis of learning progress (mastery levels, language focus)
2. 3 new vocabulary words that naturally build on what they know
3. A quick learning tip or technique to improve retention

Make suggestions specific to the language(s) they're studying.`;
    } else if (type === "overview") {
      systemPrompt = "You are a personal growth coach. Analyze overall progress and provide motivational insights.";
      userPrompt = `Based on this complete dashboard data: ${JSON.stringify(data)}
      
Provide:
1. Celebration of achievements (be specific!)
2. Pattern insights across all areas (reading, career, language)
3. One powerful suggestion to maximize growth
4. Motivational closing thought

Keep the tone warm, encouraging, and actionable.`;
    }

    console.log("Calling AI with type:", type);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service unavailable");
    }

    const aiData = await response.json();
    const insight = aiData.choices?.[0]?.message?.content;

    if (!insight) {
      throw new Error("No insight generated");
    }

    console.log("AI insight generated successfully");

    return new Response(
      JSON.stringify({ insight }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ai-insights function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
