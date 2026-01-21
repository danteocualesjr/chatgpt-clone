import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const HEALTHCARE_SYSTEM_PROMPT = `You are HealthChat, a helpful AI assistant specialized in health and healthcare information. Your role is to provide accurate, evidence-based health information while always emphasizing the importance of consulting with qualified healthcare professionals for medical advice, diagnosis, and treatment.

Guidelines:
- Provide clear, understandable explanations of health topics
- Use evidence-based information from reputable sources
- Always remind users that your responses are informational and not a substitute for professional medical advice
- Encourage users to consult healthcare professionals for personal health concerns
- Be empathetic and supportive in your communication
- If asked about specific symptoms or conditions, provide general information but strongly recommend professional consultation
- If images are shared, analyze them from a general health perspective but always recommend professional evaluation
- Never diagnose conditions from images

Remember: Your goal is to educate and inform, not to diagnose or treat.`

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const openai = new OpenAI({ apiKey })

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check if any message contains images
    const hasImages = messages.some(msg => 
      Array.isArray(msg.content) && 
      msg.content.some((c: any) => c.type === 'image_url')
    )

    // Use gpt-4o-mini for vision support
    const model = hasImages ? 'gpt-4o-mini' : 'gpt-4o-mini'

    const stream = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: HEALTHCARE_SYSTEM_PROMPT,
        },
        ...messages.map((msg: any) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error: any) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    if (error?.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (error?.status === 402) {
      return new Response(
        JSON.stringify({ error: 'OpenAI billing issue. Please check your OpenAI account.' }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
