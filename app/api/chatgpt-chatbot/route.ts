import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
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
<<<<<<< HEAD
This final prompt should start with "Content" on a new line, followed by a complete, well-organized summary of the requirements in a design-focused format, and conclude with "Content_End" on a new line.
=======
This final prompt should start with "FINAL_PROMPT_START" on a new line, followed by a complete, well-organized summary of the requirements in a design-focused format, and conclude with "FINAL_PROMPT_END" on a new line.
>>>>>>> origin/profile_updated
Only website-related information will be included in the final prompt to maintain relevance and accuracy.`;
export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        // Create the messages array with system prompt
        const chatMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content
            }))
        ];
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            messages: chatMessages,
            model: "gpt-4-turbo-preview",  // or "gpt-3.5-turbo" for a more economical option
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        
        // Extract the response
        const response = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        return NextResponse.json({ response }, { status: 200 });
    } catch (error) {
        console.error('Error in chat route:', error);
        return NextResponse.json(
            { error: 'Failed to communicate with OpenAI API' },
            { status: 500 }
        );
    }
}