import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(request: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Recipe service is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { ingredients } = body;

    if (!ingredients || typeof ingredients !== 'string') {
      return NextResponse.json(
        { error: 'Ingredients string is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a Michelin Star Chef specializing in vegetarian organic cuisine. 
    Create a unique, healthy recipe using these main ingredients: ${ingredients}. 
    Format nicely with: 
    1. Creative Name 
    2. Ingredients List 
    3. Step-by-Step Instructions. 
    Keep it under 300 words.`;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ recipe: text });
  } catch (error: any) {
    console.error('Recipe API Error:', error);
    return NextResponse.json(
      { error: 'Recipe generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
