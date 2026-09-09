# 🗺️ Frontend Architecture & Routing

## 🏗️ The App Router Model (Next.js 15)
The traditional React SPA approach (using `useState` to toggle views) was discarded in favor of the **Next.js App Router**. This provides real URLs, better performance, and optimized data fetching.

### Layouts vs. Pages
The Dashboard UI utilizes nested routing to prevent static elements from re-rendering:
- **`app/layout.tsx`**: The root layout. It contains the base HTML (`<html>`, `<body>`) and defines the application fonts (Geist Sans/Mono) globally.
- **`app/dashboard/layout.tsx`**: The private dashboard wrapper. It renders the `<Sidebar>` and the top `<Header>`. These components remain persistent and **do not reload** during client-side navigation.
- **`app/dashboard/page.tsx`**: The specific view injected into the layout via the `children` prop.

## 🔀 Dynamic Routing
To avoid massive code duplication for views that share the same UI structure but display different data (e.g., player profiles or match details), bracketed folders `[ ]` are used.

### Implemented Use Cases:
1. **Player Profiles (`/players/[playerName]/page.tsx`)**
   - Captures the slug from the URL (e.g., `localhost:3000/dashboard/players/nyssan`).
   - Injects the async `params` variable (`await params.playerName`) into the `<TeamPlayersDashboard>` component.
   - The component filters the local database for the specific player and renders their metrics in the Tracker UI.

2. **Pracc Details (`/praccs/[matchId]/page.tsx`)**
   - Uses the unique database UUID (e.g., `/praccs/123e4567...`) to avoid naming collisions (e.g., having 5 scrims played on Pearl).
   - Performs a server-side query (`prisma.match.findUnique`) before serving the client.
   - If the ID does not exist, Next.js's native `notFound()` function is triggered to render a 404 error page.

## 🧩 Modular Design & Separation of Concerns
Complex visual code does not live inside the routing directory (`app/`); instead, it is extracted to **`src/modules/`**.
- Routes (`page.tsx`) act solely as **Controllers**: they fetch data (from Prisma/APIs) and pass it down.
- Modules (e.g., `PraccView`, `TeamMapsDashboard`) receive the data and handle strictly the UI rendering (Charts, Tables, Interactivity).