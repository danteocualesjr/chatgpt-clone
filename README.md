# HealthChat

A modern, healthcare-focused AI chat application powered by OpenAI's GPT models.

## Features

- Real-time AI chat with streaming responses
- Healthcare-focused AI assistant
- Chat history with local storage
- Dark/light mode
- Responsive design

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your OpenAI API key

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-3.5-turbo
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure

```
├── app/
│   ├── api/chat/route.ts    # OpenAI streaming endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Chat/                # Chat UI components
│   └── Sidebar/             # Sidebar components
├── context/
│   └── ChatContext.tsx      # Chat state management
└── lib/
    ├── openai.ts            # OpenAI client & system prompt
    ├── types.ts
    └── utils.ts
```

## Disclaimer

HealthChat provides general health information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
