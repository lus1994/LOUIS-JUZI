
import { GoogleGenAI, Type } from "@google/genai";
import { ClothingCategory, Season, OutfitSuggestion, ClothingItem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image of clothing to extract metadata (Category, Color, Season).
 */
export const analyzeImage = async (base64Image: string): Promise<{ category: ClothingCategory, color: string, season: Season, brand: string }> => {
  try {
    // Remove header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this clothing item. Identify the category, dominant color (in Chinese), appropriate season, and brand (if visible, otherwise predict style in Chinese). Return JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: [
                ClothingCategory.TOP,
                ClothingCategory.BOTTOM,
                ClothingCategory.DRESS,
                ClothingCategory.OUTERWEAR,
                ClothingCategory.SHOES,
                ClothingCategory.ACCESSORY,
                ClothingCategory.UNKNOWN
              ]
            },
            color: { type: Type.STRING, description: "Color name in Chinese (Simplified)" },
            season: {
              type: Type.STRING,
              enum: [
                Season.SUMMER,
                Season.WINTER,
                Season.SPRING_AUTUMN,
                Season.ALL_YEAR
              ]
            },
            brand: { type: Type.STRING, description: "Brand name or Style description in Chinese" }
          },
          required: ["category", "color", "season", "brand"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      category: result.category as ClothingCategory,
      color: result.color || "未知",
      season: result.season as Season,
      brand: result.brand || "通用"
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback defaults in case of error
    return {
      category: ClothingCategory.UNKNOWN,
      color: "未知",
      season: Season.ALL_YEAR,
      brand: "未知"
    };
  }
};

/**
 * Generates outfit suggestions based on available inventory and context (weather/occasion).
 */
export const generateOutfitSuggestions = async (
  inventory: ClothingItem[],
  occasion: string,
  weather: string
): Promise<OutfitSuggestion[]> => {
  if (inventory.length === 0) return [];

  // Create a lightweight text representation of the inventory to save tokens
  const inventoryList = inventory.map(item => 
    `ID: ${item.id}, Type: ${item.category}, Color: ${item.color}, Season: ${item.season}`
  ).join("\n");

  const prompt = `
    你是一位专业的时尚造型师。请使用中文回答。
    
    Context:
    - 场合: ${occasion}
    - 天气: ${weather}
    
    Inventory:
    ${inventoryList}

    Task: Create 3 distinct outfit combinations from the provided inventory. 
    Select items by their ID. Return a JSON array. 
    The "outfitName" and "reasoning" must be in Chinese.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              outfitName: { type: Type.STRING },
              itemIds: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reasoning: { type: Type.STRING }
            },
            required: ["outfitName", "itemIds", "reasoning"]
          }
        }
      }
    });

    const suggestions = JSON.parse(response.text || "[]");
    return suggestions as OutfitSuggestion[];

  } catch (error) {
    console.error("Gemini Styling Error:", error);
    return [];
  }
};
