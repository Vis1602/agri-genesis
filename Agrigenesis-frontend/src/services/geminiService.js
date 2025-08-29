const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;



export const askAI = async (prompt) => {
  try {
    console.log("=== AI Assistant Debug ===");
    console.log("GEMINI_API_KEY:", GEMINI_API_KEY ? "Present" : "Missing");
    console.log("Prompt received:", prompt);
    console.log("API URL:", GEMINI_API_URL);
    
    if (!GEMINI_API_KEY) {
      console.error("API key is missing!");
      throw new Error("GEMINI_API_KEY is not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file");
    }

    if (!prompt || prompt.trim().length === 0) {
      throw new Error("No prompt provided");
    }

    console.log("Making API request to Gemini...");
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an AI assistant for AgriGenesis, an agricultural platform that connects farmers with experts. You help farmers with agricultural questions, crop advice, farming techniques, pest control, soil management, and general farming guidance. Be helpful, accurate, and concise in your responses. 

User question: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      throw new Error("No response received from Gemini API");
    }

    return {
      success: true,
      answer: answer.trim(),
    };
  } catch (error) {
    console.error("AI Assistant error:", error);
    return {
      success: false,
      error: error.message,
      answer: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact a human expert for assistance."
    };
  }
};

export const askAIWithContext = async (prompt, context = "") => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!prompt || prompt.trim().length === 0) {
      throw new Error("No prompt provided");
    }

    const contextualPrompt = context 
      ? `Context: ${context}\n\nUser question: ${prompt}`
      : prompt;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an AI assistant for AgriGenesis, an agricultural platform. You help farmers with agricultural questions, crop advice, farming techniques, pest control, soil management, and general farming guidance. 

${contextualPrompt}

Please provide a helpful, accurate, and concise response. If the question is not related to agriculture, politely redirect the conversation to farming topics.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      throw new Error("No response received from Gemini API");
    }

    return {
      success: true,
      answer: answer.trim(),
    };
  } catch (error) {
    console.error("AI Assistant error:", error);
    return {
      success: false,
      error: error.message,
      answer: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact a human expert for assistance."
    };
  }
};
