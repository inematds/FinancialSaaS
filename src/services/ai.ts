import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// IMPORTANT: This requires VITE_GEMINI_API_KEY in .env.local
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_NAME = 'gemini-2.5-flash'; // Stable available model

// Lazy initialization helper
const getGenAI = () => {
    if (!API_KEY) return null;
    return new GoogleGenerativeAI(API_KEY);
};

export interface AIAnalysisResult {
    score: number;
    insight: string;
    recommendation: string;
}

export async function getFinancialAdvisorResponse(
    userContext: any,
    userMessage: string
): Promise<string> {
    const genAI = getGenAI();
    if (!genAI) {
        return "I'm sorry, my AI brain hasn't been connected yet. Please add the VITE_GEMINI_API_KEY to your configuration.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `
            You are FinPilot, an expert AI Financial Advisor. 
            Your goal is to provide accurate, helpful, and personalized financial advice.
            
            Current User Context:
            ${JSON.stringify(userContext, null, 2)}
            
            User Question: "${userMessage}"
            
            Provide a concise, professional, and encouraging response. 
            If the user asks about their specific data (like "how much money do I have?"), use the provided context.
            Do not make up numbers if they aren't in the context.
            Format your response with markdown if helpful.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "I'm having trouble connecting to my financial knowledge base right now. Please try again later.";
    }
}

export async function analyzeGoalFeasibility(
    goal: any,
    portfolioValue: number,
    monthlyContribution: number = 0 // Assumption for now
): Promise<AIAnalysisResult> {
    const genAI = getGenAI();
    if (!genAI) {
        return {
            score: 0,
            insight: "AI configuration missing.",
            recommendation: "Please configure your API key."
        };
    }

    // Use monthlyContribution to avoid unused variable lint warning (even if logic is simple for now)
    const annualContribution = monthlyContribution * 12;

    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `
            Analyze the feasibility of this financial goal:
            Goal: ${goal.name}
            Target: $${goal.target_amount}
            Current Saved: $${goal.current_amount}
            Deadline: ${goal.deadline || 'None'}
            
            Portfolio Total Value: $${portfolioValue}
            Annual Contribution (Est): $${annualContribution}
            
            Task:
            1. Calculate a probability score (0-100) of achieving this goal based on current progress and standard market returns (assume 7% annual return on portfolio).
            2. Provide a 1-sentence insight on the status.
            3. Provide a 1-sentence actionable recommendation.
            
            Return ONLY a JSON object in this format:
            {
                "score": number,
                "insight": "string",
                "recommendation": "string"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error analyzing goal:', error);
        return {
            score: 50,
            insight: "Analysis unavailable.",
            recommendation: "Review your goal manually."
        };
    }
}
