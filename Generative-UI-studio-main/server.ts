import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { generateDynamicDomainSchema } from "./src/utils/schemaSynthesizer";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini AI setup
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint: Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// System prompt instructing Gemini to return high quality Generative UI JSON schemas
const GENERATIVE_UI_SYSTEM_PROMPT = `You are an expert Generative UI system designer and UI/UX engineer.
Your task is to take a user's natural language request and generate a complete, rich, highly-functional, interactive UI dashboard schema in JSON.

Guidelines for Generative UI:
1. DESIGN REAL DOMAIN-MATCHED WORKFLOWS: Match the user prompt's exact domain (e.g. food delivery, SaaS, e-commerce, fitness, travel).
   - For CONSUMER APPS (e.g. food delivery like Swiggy/FoodRush, shopping, fitness, travel), DO NOT force SaaS charts or admin graphs! Use consumer components:
     * "restaurant_list": title, subtitle, restaurants array (id, name, cuisine, rating, reviewsCount, deliveryTime, distance, priceForTwo, offerBadge, imageUrl).
     * "food_category_grid": title, categories array (id, name, icon, imageUrl, offerText).
     * "food_menu": title, subtitle, items array (id, name, description, price, rating, imageUrl, isVeg, isBestseller, category).
     * "image": title, description, url (high-quality Unsplash image URL matching the prompt), aspectRatio ("video" | "square" | "wide").
   - For SAAS / B2B ADMIN APPS (e.g. analytics, devops, finance): use metrics, charts, tables, kanban boards, and calculators.

2. RICH STRUCTURE:
   - "metrics": 3 to 4 stat cards for admin dashboards (omit for consumer apps if not applicable).
   - "theme": accentColor ("emerald", "indigo", "violet", "amber", "rose", "sky", "cyan") and style ("modern").
   - "layout": Array of sections with gridCols (1, 2, 3) containing UI components.
3. ALWAYS output VALID JSON conforming strictly to the requested structure.
4. DO NOT return markdown wrappers like \`\`\`json or extra text, JUST raw valid JSON.`;

app.post("/api/generate-ui", async (req, res) => {
  const { prompt, currentSchema, action, theme, model } = req.body || {};

  try {
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    if (!ai && !process.env.OPENROUTER_API_KEY) {
      console.warn("GEMINI_API_KEY and OPENROUTER_API_KEY are missing. Falling back to dynamic domain schema synthesizer.");
      const fallbackSchema = generateDynamicDomainSchema(prompt, theme);
      return res.json({
        schema: fallbackSchema,
        fallback: true,
        message: "Gemini API key or OpenRouter API key not found in environment. Using dynamic domain schema synthesizer."
      });
    }

    let userInstruction = "";
    if (action === "refine" && currentSchema) {
      userInstruction = `Modify the existing UI schema based on this user request: "${prompt}".
Existing UI Schema Title: "${currentSchema.title}".
Keep existing layout elements unless explicitly asked to remove them, and add or update requested components/charts/metrics/forms.`;
    } else {
      userInstruction = `Create a brand new Generative UI for this natural language request: "${prompt}". Make it detailed, visually complete, with rich charts, KPI stats, interactive controls, and realistic data.`;
    }

    if (theme) {
      userInstruction += `\nInclude theme preferences: accentColor="${theme.accentColor || 'emerald'}", style="${theme.style || 'modern'}", mode="${theme.mode || 'light'}", fontFamily="${theme.fontFamily || 'Plus Jakarta Sans'}", borderRadius="${theme.borderRadius || 'lg'}".`;
    }

    let modelName = "gemini-2.5-flash"; // default stable model
    if (model) {
      if (model.includes("Pro") || model.includes("pro") || model.includes("3.5")) {
        modelName = "gemini-2.5-pro";
      } else if (model.includes("Ultra") || model.includes("ultra") || model.includes("3.0")) {
        modelName = "gemini-2.5-pro";
      } else if (model.includes("Flash") || model.includes("flash") || model.includes("3.6")) {
        modelName = "gemini-2.5-flash";
      }
    }

    let generatedSchema: any = null;

    if (process.env.OPENROUTER_API_KEY) {
      const openRouterModel = modelName === "gemini-2.5-pro" ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";
      console.log(`Calling OpenRouter API (${openRouterModel})...`);
      
      let openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3001",
          "X-Title": "Generative UI Studio"
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: [
            { role: "system", content: GENERATIVE_UI_SYSTEM_PROMPT },
            { role: "user", content: userInstruction }
          ],
          response_format: { type: "json_object" },
          max_tokens: 4000
        })
      });

      // Fallback to free Gemini model if the primary request fails (e.g. 402 payment required)
      if (!openRouterResponse.ok) {
        console.warn(`OpenRouter primary model (${openRouterModel}) failed with status ${openRouterResponse.status}. Attempting free model fallback...`);
        openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3001",
            "X-Title": "Generative UI Studio"
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash:free",
            messages: [
              { role: "system", content: GENERATIVE_UI_SYSTEM_PROMPT },
              { role: "user", content: userInstruction }
            ],
            response_format: { type: "json_object" },
            max_tokens: 4000
          })
        });
      }

      if (!openRouterResponse.ok) {
        const errText = await openRouterResponse.text();
        throw new Error(`OpenRouter API error: ${openRouterResponse.status} - ${errText}`);
      }

      const openRouterData = await openRouterResponse.json();
      const contentText = openRouterData.choices?.[0]?.message?.content;
      if (contentText) {
        const cleanJson = contentText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        try {
          generatedSchema = JSON.parse(cleanJson);
        } catch (parseErr) {
          const firstBrace = cleanJson.indexOf('{');
          const lastBrace = cleanJson.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            try {
              generatedSchema = JSON.parse(cleanJson.slice(firstBrace, lastBrace + 1));
            } catch (e2) {
              console.warn("JSON slice parse failed, falling through to synthesizer:", parseErr);
            }
          }
        }
      }
    } else if (ai) {
      console.log(`Calling native Google Gen AI API (${modelName})...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          { text: GENERATIVE_UI_SYSTEM_PROMPT },
          { text: userInstruction }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              theme: {
                type: Type.OBJECT,
                properties: {
                  accentColor: { type: Type.STRING },
                  style: { type: Type.STRING },
                  mode: { type: Type.STRING },
                  fontFamily: { type: Type.STRING },
                  borderRadius: { type: Type.STRING },
                  primaryHex: { type: Type.STRING },
                  bgHex: { type: Type.STRING },
                  surfaceHex: { type: Type.STRING }
                },
                required: ["accentColor", "style"]
              },
              generatedPrompt: { type: Type.STRING },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                    change: { type: Type.STRING },
                    trend: { type: Type.STRING },
                    subtext: { type: Type.STRING },
                    format: { type: Type.STRING },
                    icon: { type: Type.STRING },
                    sparkline: {
                      type: Type.ARRAY,
                      items: { type: Type.NUMBER }
                    }
                  },
                  required: ["id", "label", "value"]
                }
              },
              initialState: {
                type: Type.OBJECT,
                properties: {
                  status: { type: Type.STRING }
                }
              },
              layout: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    gridCols: { type: Type.INTEGER },
                    components: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          type: { type: Type.STRING },
                          title: { type: Type.STRING },
                          subtitle: { type: Type.STRING },
                          chartType: { type: Type.STRING },
                          xAxisKey: { type: Type.STRING },
                          dataKeys: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                key: { type: Type.STRING },
                                name: { type: Type.STRING },
                                color: { type: Type.STRING }
                              }
                            }
                          },
                          data: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                name: { type: Type.STRING }
                              }
                            }
                          },
                          fields: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                id: { type: Type.STRING },
                                name: { type: Type.STRING },
                                label: { type: Type.STRING },
                                fieldType: { type: Type.STRING },
                                placeholder: { type: Type.STRING },
                                min: { type: Type.NUMBER },
                                max: { type: Type.NUMBER },
                                unit: { type: Type.STRING }
                              }
                            }
                          },
                          columns: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                key: { type: Type.STRING },
                                label: { type: Type.STRING },
                                type: { type: Type.STRING }
                              }
                            }
                          },
                          inputs: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                id: { type: Type.STRING },
                                label: { type: Type.STRING },
                                value: { type: Type.NUMBER },
                                min: { type: Type.NUMBER },
                                max: { type: Type.NUMBER },
                                step: { type: Type.NUMBER },
                                unit: { type: Type.STRING }
                              }
                            }
                          },
                          outputs: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                id: { type: Type.STRING },
                                label: { type: Type.STRING },
                                formulaDescription: { type: Type.STRING },
                                format: { type: Type.STRING },
                                calculatedValue: { type: Type.NUMBER }
                              }
                            }
                          },
                          message: { type: Type.STRING },
                          severity: { type: Type.STRING },
                          actions: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                id: { type: Type.STRING },
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                icon: { type: Type.STRING },
                                buttonText: { type: Type.STRING }
                              }
                            }
                          }
                        },
                        required: ["id", "type", "title"]
                      }
                    }
                  },
                  required: ["id", "components"]
                }
              },
              workflows: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    trigger: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                    status: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["id", "title", "description", "category", "theme", "metrics", "layout"]
          }
        }
      });

      let schemaText = response.text;
      if (!schemaText) {
        throw new Error("No response text received from Gemini");
      }

      schemaText = schemaText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      generatedSchema = JSON.parse(schemaText);
    }

    generatedSchema.id = generatedSchema.id || `gen_${Date.now()}`;
    generatedSchema.generatedPrompt = prompt;

    const cleanAndTrimTitle = (title?: string, fallbackPrompt?: string): string => {
      const target = title || fallbackPrompt || "Custom Application";
      const clean = target
        .replace(/^(build|create|design|generate|make|set up|setup|show me|a|an|the|modern|premium|visually|appealing|mobile|web|ui)\s+/i, '')
        .trim();
      const words = clean.split(/\s+/);
      if (words.length > 5 || clean.length > 40) {
        const shortTitle = words.slice(0, 4).join(' ');
        return shortTitle.charAt(0).toUpperCase() + shortTitle.slice(1) + '...';
      }
      return clean.charAt(0).toUpperCase() + clean.slice(1);
    };

    generatedSchema.title = cleanAndTrimTitle(generatedSchema.title, prompt);

    return res.json({ schema: generatedSchema });
  } catch (err: any) {
    console.warn("Gemini API rate limit or request error encountered. Serving dynamic domain schema synthesizer:", err?.message || err);
    const fallbackSchema = generateDynamicDomainSchema(prompt, theme);
    return res.json({ schema: fallbackSchema, fallback: true });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
