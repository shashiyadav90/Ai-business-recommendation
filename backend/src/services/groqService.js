import groq from "../config/groq.js";
import {
  listedCompanies,
  nonListedCompanies
} from "../data/companies.js";

export const getChatResponse = async (message) => {
  try {

    const prompt = `
You are a Business Recommendation Assistant.

AVAILABLE LISTED COMPANIES:

${JSON.stringify(listedCompanies, null, 2)}

AVAILABLE NON-LISTED COMPANY CATEGORIES:

${JSON.stringify(nonListedCompanies, null, 2)}

USER REQUIREMENT:
${message}

TASK:

1. Understand the user's business requirement.
2. Recommend the most relevant listed companies.
3. If no listed company matches, recommend suitable non-listed categories.
4. Include company description.
5. Include services.
6. Include email and phone for listed companies.
7. Return ONLY valid JSON.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use \`\`\`json.
- Do not add explanations outside JSON.

JSON FORMAT:

{
  "requirement": "",
  "listedRecommendations": [
    {
      "name": "",
      "description": "",
      "services": [],
      "email": "",
      "phone": ""
    }
  ],
  "nonListedRecommendations": [
    {
      "category": "",
      "description": ""
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content:
            "You are an expert business recommendation assistant. Always return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = completion.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (error) {
      return {
        rawResponse: content
      };
    }

  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
};