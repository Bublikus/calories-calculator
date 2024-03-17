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
              },
            },
            {
              type: "text",
              text: `From the provided image try to recognize and roughly calculate the amount of calories in the food. Return back ONLY the rough number! WITHOUT ANY EXPLANATIONS, RETURN JUST A ROUGH AMOUNT OF CALORIES! If you can\'t recognize the food, please always response with "I can\'t recognize the food".`,
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
