# AI Chatbot

This is a chatbot web application that uses OpenAI's gpt-3.5-turbo model for generating responses, or essentially a simplified ChatGPT clone.

## Tech Stack / Dependencies

- Next.js (App Router)
- Supabase
- Auth.js (also known as NextAuth.js)
- shadcn/ui and Radix UI
- Tailwind CSS
- zustand
- OpenAI

Please note that you are required to have an OpenAI API key to use this app.

## Architectural Details

Next.js is used for the full-stack development of the web app. API routes are used for the interaction wtih the database and the AI model.

For the database, Supabase is used, which is a PostgreSQL-compatible managed database service. There are mainly three tables:

`users` - for storing user information.
`chat_sessions` - for storing individual chat session information.
`chat_messages` - for storing the chat messages sent by the user and received from the AI model in a particular chat session.

For `chat_sessions` and `chat_messages`, UUIDv7 is used it's time-sortable property which is useful for indexing.

Authentication is handled using Auth.js, which is a library for authentication in Next.js. Currently, only Google OAuth is implemented.

shadcn/ui is used for the UI components, which uses Radix UI internally.

Tailwind CSS is used for styling.

zustand is used for easy global state management, specifically for the sidebar chat history.

OpenAI is used for the AI model - every prompt submitted by the user is sent to OpenAI's API to generate a response. The web app uses the gpt-3.5-turbo model.

## Getting Started (Local Development)

1. Clone the repository

2. Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Make sure you have Supabase CLI and Docker installed. For more information, visit the [Supabase CLI documentation](https://supabase.com/docs/guides/local-development).

4. Run the following command to start the Supabase local development server:

```bash
supabase start
```

This will start the Supabase local development server. Take note of `API URL` and `service_role_key` as you will need them to configure the `.env` file.

5. Run the following command to create the required database tables:

```bash
supabse db reset
```

This will automatically run the migrations in the `supabase/migrations` directory.

6. Create a `.env` file and add your environment variables. You can use the `.env.example` file as a template.

7. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Deployment

This project is deployed on Vercel. If you are deploying this project, make sure to run the supabase migrations in the `supabase/migrations` directory.
