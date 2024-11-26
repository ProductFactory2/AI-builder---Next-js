import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try { 

        const generationPrompt = `Generate a complete website template based on these requirements:
        ${finalPrompt}

        Rules:
        1. Generate a single complete template with multiple pages
        2. Each page should be a separate HTML file (index.html, about.html, etc.)
        3. Use Tailwind CSS for styling
        4. Make all pages responsive
        5. Include proper meta tags and SEO elements
        6. Follow accessibility standards
        7. Use semantic HTML
        8. Include navigation between pages

        Return the response in this exact JSON format like this:
        {
            "data": [
                {
                    "template": [
                        { "index.html": "full HTML content" },
                        { "about.html": "full HTML content" },
                        { "contact.html": "full HTML content" }
                    ]
                }
            ],
            "userId": "${userId}",
            "projectName": "${name}"
        }`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: generationPrompt }],
            model: "gpt-4-turbo-preview",
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" }
        });

        const generatedContent = completion.choices[0]?.message?.content;

        if (!generatedContent) {
            throw new Error('Failed to generate content');
        }

        return NextResponse.json(JSON.parse(generatedContent));

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate website template' },
            { status: 500 }
        );
    }
}