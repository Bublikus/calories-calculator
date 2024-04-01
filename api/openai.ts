import OpenAI from "openai";

const openai = new OpenAI({
  organization: process.env.NEXT_PUBLIC_OPENAI_ORG_ID,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const fetchChatGPTResponse = async (image: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      stream: false,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "low",
              },
            },
            {
              type: "text",
              text: `Identify the types and quantities of food items present in this image, and its approximate portion size or weight, and any noticeable ingredients or preparation methods. Estimate the total caloric in min-max range for each food item based on its identified type and quantity. Summarize the findings with a rounded total and average calories count for the meal presented in the image, and write back ONLY 1 SHORT SENTENCE in the following format: "Total calories range is: {{min}}-{{max}} (avg: {{avg}})" WITHOUT ANY ADDITIONAL INFORMATION.`,
            },
          ],
        },
      ],
    });

    return response.choices[0].message.content || "Empty response from ChatGPT";
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);

    return `Error fetching ChatGPT response: ${error}`;
  }
};
