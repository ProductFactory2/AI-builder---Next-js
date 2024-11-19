import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input, history } = body;
    if (!input) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };
    // Initial system instruction
    const systemPrompt = `You are an assistant specifically designed to gather requirements for building a website.
    Your primary role is to ask one concise question at a time to fully understand the user's needs.
    Each question should be clear and focused, with responses limited to 30 words.
    Avoid lengthy paragraphs in both your questions and responses.
    Do not repeat the same questions, and use follow-up questions only if necessary to clarify unclear responses or gather essential details that were missed.
    If the user mentions topics unrelated to website creation, gently redirect the conversation back by informing them that you are here specifically to help gather website design requirements.
    If the user continues providing unrelated or irrelevant information, remind them that only website-related details will be used to generate the final prompt.
    If the user shifts to describing a different website or project mid-conversation, confirm this change in direction to ensure clarity, then continue asking relevant questions based on the updated context if they confirm the shift.
    Your goal is to gather all critical aspects of the website, such as its purpose, target audience, key features, design preferences, content needs, and any technical requirements.
    This includes specific details like navigation structure, branding, interactivity, third-party integrations, and accessibility standards.
    Once all requirements are gathered, create a final prompt to instruct another AI model to generate the website design.
    This final prompt should start with "finalPromptStart" on a new line, followed by a complete, well-organized summary of the requirements in a design-focused format, and conclude with "finalPromptEnd" on a new line.
    Only website-related information will be included in the final prompt to maintain relevance and accuracy.`;
    const chat = model.startChat({
      generationConfig,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    });
    const result = await chat.sendMessage(input);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}