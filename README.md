# santiagovittor.store

Personal services website for Santiago Vittor — Full-Stack Developer
and AI Specialist based in Buenos Aires, Argentina.

Live at [santiagovittor.store](https://santiagovittor.store)

## Stack

- Next.js 15 App Router
- TypeScript strict
- Tailwind CSS v4 (CSS-first, no config file)
- motion/react v12
- react-hook-form + zod
- Resend (contact form)
- Vercel (hosting)

## Structure

src/app/api/contact — Contact form API route  
src/app/layout.tsx — Root layout  
src/components/sections — All page sections  
src/components/StarField.tsx — Canvas starfield animation  
src/hooks — useSpotlight  
src/lib — constants, utils  
public — favicon, static assets  

## Local Development

Install dependencies and start the dev server:

    npm install
    npm run dev

Requires .env.local in the project root:

    RESEND_API_KEY=your_key_here

## Deploy

Connected to Vercel via GitHub. Push to main triggers production deploy.