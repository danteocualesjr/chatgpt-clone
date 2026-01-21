import { openai, HEALTHCARE_SYSTEM_PROMPT } from '@/lib/openai'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', { status: 400 })
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: HEALTHCARE_SYSTEM_PROMPT,
        },
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
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
        } catch (error) {
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
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
