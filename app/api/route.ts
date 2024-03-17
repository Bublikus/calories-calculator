import { fetchChatGPTResponse } from "@/api/openai";

export const POST = async (req: Request) => {
  const body = await req.clone().json();
  const response = await fetchChatGPTResponse(body.image);

  return new Response(response);
};
