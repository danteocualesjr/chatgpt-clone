# HealthChat

A modern, healthcare-focused AI chat application built with Next.js, featuring real-time conversations, healthcare-specific context, and a beautiful UI.

## Features

- 🤖 **AI-Powered Conversations**: Powered by OpenAI's GPT models with healthcare-focused system prompts
- 💬 **Real-time Streaming**: See AI responses stream in real-time as they're generated
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📝 **Chat History**: Automatically saves your conversations in localStorage
- 🏥 **Healthcare-Focused**: Pre-configured with medical context and conversation starters
- ⚠️ **Medical Disclaimers**: Includes appropriate disclaimers about medical advice

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chatgpt-clone
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
chatgpt-clone/
├── app/
│   ├── api/chat/route.ts    # Chat API endpoint
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main chat page
│   └── globals.css          # Global styles
├── components/
│   ├── Chat/                # Chat components
│   └── Sidebar/             # Sidebar components
├── hooks/
│   └── useChat.ts           # Chat state management
├── lib/
│   ├── openai.ts            # OpenAI client
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## Usage

1. **Start a New Chat**: Click the "New Chat" button in the sidebar
2. **Send Messages**: Type your question in the input area and press Enter or click Send
3. **View History**: Access your previous conversations from the sidebar
4. **Delete Chats**: Hover over a chat in the sidebar and click the trash icon
5. **Toggle Dark Mode**: Click the moon/sun icon in the bottom right

## Healthcare Features

- **System Prompt**: Configured to provide health information while emphasizing professional consultation
- **Conversation Starters**: Pre-populated with health-related prompts
- **Medical Disclaimer**: Clear disclaimers that this is not a substitute for professional medical advice

## Technology Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API (GPT-3.5-turbo)
- **State Management**: React Hooks + localStorage
- **Markdown Rendering**: react-markdown

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

## Disclaimer

HealthChat provides general health information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding a medical condition.
# chatgpt-clone
