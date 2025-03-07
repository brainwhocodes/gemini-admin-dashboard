import { GoogleAIFileManager } from "@google/generative-ai/server"

export default defineEventHandler(async() => {
  // Ensure API key is available
  const apiKey = process.env.GOOGLE_GEN_API_KEY;
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API key is missing',
    });
  }

  const fileManager = new GoogleAIFileManager(apiKey);

  const listFilesResponse = await fileManager.listFiles();

  return listFilesResponse
})