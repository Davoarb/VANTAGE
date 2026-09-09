# 🔒 Backend, Authentication & Database

## 🗄️ Database & ORM (PostgreSQL + Prisma)
The application relies on a robust relational database hosted on **Supabase (PostgreSQL)**[cite: 10]. To interact with the database safely and with full TypeScript type-safety, we use **Prisma ORM**[cite: 10].

- **Server-Side Data Fetching:** Leveraging the Next.js App Router, database queries (e.g., `prisma.match.findUnique`) are executed directly within Server Components (the `page.tsx` files)[cite: 10]. This eliminates the need for intermediate API routes and drastically reduces client-side JavaScript payloads[cite: 10].
- **Relational Integrity:** Prisma handles complex relationships, such as fetching a match alongside all its participating players in a single query (`include: { players: true }`)[cite: 10].

## 🛡️ Authentication (Supabase SSR)
Authentication is built using the `@supabase/ssr` package to ensure a secure, server-rendered authentication flow that relies on HTTP-only cookies[cite: 10].

### Next.js 15 Async Cookies Integration
A critical architectural implementation was adapting the Supabase server client (`src/lib/supabase/server.ts`) to support the new asynchronous cookie handling introduced in Next.js 15[cite: 10]. 
- The utility function awaits the Next.js `cookies()` instance before attempting to read or write session tokens, preventing runtime asynchronous errors[cite: 10].
- Session tokens are safely managed across Server Components, Server Actions, and Route Handlers without exposing them to the client-side window object[cite: 10].

## ⚡ Server Actions & Telemetry API
Traditional REST API routes (`/api/login`) were replaced by **Next.js Server Actions** for form submissions and mutations[cite: 10].

### The Guest Login Flow:
1. **The Trigger:** The user clicks "Entrar como Invitado" on the root landing page (`/`)[cite: 10].
2. **The Action:** The form triggers the `signInAsGuest` Server Action[cite: 10].
3. **Execution:** The action creates a secure server-side Supabase client, calls `signInAnonymously()`, and writes the authentication cookie securely[cite: 10].
4. **Redirection:** Upon success, Next.js natively redirects the user to `/dashboard` using `redirect('/dashboard')`[cite: 10].

### 📡 Ingestion Endpoint (`/api/upload-pracc`)
For automated telemetry ingestion from the local desktop client, a dedicated Route Handler is maintained. To ensure scalability, the heavy mathematical lifting (Big Data parsing, KAST calculation, Economy evaluation) is decoupled into dedicated utility modules (`analytics.js` and `constants.js`), keeping the Route Handler strictly focused on Prisma database transactions and error handling (e.g., catching duplicate entries).