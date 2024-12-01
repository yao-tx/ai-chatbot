# AI Chatbot

This is a chatbot web application that uses OpenAI's gpt-3.5-turbo model for generating responses, or essentially a simplified ChatGPT clone.

## Tech Stack / Dependencies

- Next.js (for the app)
- Tailwind CSS (for styling)
- Supabase (for the database)
- OpenAI (for the AI model)
- shadcn/ui / Radix UI (for UI components)
- NextAuth.js (for Authentication)

Please note that you are required to have an OpenAI API key to use this app.

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
