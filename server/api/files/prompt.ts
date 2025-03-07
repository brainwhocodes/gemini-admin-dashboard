import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async(event) => {
    const promptData = { data: {}}
    const file = {
      fileUri: null,
      mimeType: null
    }
    if (!promptData || !promptData.data) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing prompt in form data.",
      });
    }
    // 3. Content Generation
    const result = await model.generateContent([
      {
        fileData: {
          fileUri: file.fileUri,
          mimeType: file.mimeType,
        },
      },
      { text: prompt },
    ]);

    return {
      response: result.response.text(),
    };
  

  
})