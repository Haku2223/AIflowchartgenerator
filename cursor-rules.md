# AI Flowchart Generator - Project Rules

## Project Instructions
- Use these specifications and guidelines as you build or modify the AI Flowchart Generator app.
- Write the complete code for every step—avoid partial or placeholder solutions.
- Aim to fully implement features as requested, including any edge cases and error handling.

## Overview
This project is a web application that:
- Accepts user input (text prompt).
- Interacts with OpenAI (ChatGPT API) to generate Mermaid.js flowcharts.
- Renders flowcharts in the browser (React).
- Handles credit purchase through Stripe.
- Stores user data/credits in Supabase.

## Tech Stack
- Frontend: React, fetch/axios for HTTP calls
- Backend: Node.js, Express
- Database/Storage: Supabase
- Payments: Stripe
- AI: OpenAI (ChatGPT)
- Deployment: Vercel (frontend) + Render (backend) (or any other Node-friendly host)

## Project Structure
```
├── package.json
├── .env.example
├── server/
│   ├── index.js
│   ├── controllers/
│   │   ├── flowchart-controller.js
│   │   └── payment-controller.js
│   ├── routes/
│   │   ├── flowchart-routes.js
│   │   └── payment-routes.js
│   ├── services/
│   │   ├── chatgpt-service.js
│   │   ├── stripe-service.js
│   │   └── supabase-service.js
│   ├── middlewares/
│   ├── utils/
│   └── config/
├── shared/
│   └── constants.js
└── src/
    ├── App.js
    ├── index.js
    └── (additional React components, hooks, etc.)
```

Note: If you introduce more React components, consider grouping them in src/components/ or by feature.

## General Rules

### Folder & File Naming
- Use kebab-case (e.g., flowchart-controller.js) for all filenames and folders.
- Exception: React components can follow PascalCase (e.g., FlowchartViewer.jsx) if you prefer, but remain consistent.

### Imports
- Import server modules (e.g., controllers, services) within the server/ folder using relative paths (../services/chatgpt-service).
- For React components, use relative paths from src/.
- Keep external imports (npm packages) at the top of each file.

### Commit Guidelines
- Write meaningful commit messages describing changes.
- Group related changes into a single commit.

### Comments
- Keep them clear and concise.
- Document tricky logic or reason behind certain decisions.

### Error Handling
- Return structured error messages (e.g., { success: false, message: '...error...' }) from the backend.
- Log errors to console (or a logging service) in production, but do not expose sensitive information.

## Env Rules

### Environment Variables
- All secrets go in .env (which is not committed).
- Maintain an updated .env.example with placeholder values for others to replicate.

### Frontend vs. Backend
- Do not expose sensitive environment variables to the frontend.
- For variables needed in React (e.g., some public config), prefix them with REACT_APP_ or NEXT_PUBLIC_ (if you ever switch to Next.js).
- Use process.env.VARIABLE_NAME in Node.js/Express.
- For local dev, dotenv loads .env.
- On Render or other hosts, set environment variables through the dashboard.

## Type & Code Rules (If Introducing TypeScript)

### File Naming
- Suffix TypeScript files with .ts or .tsx for React components.
- Keep type definitions in a types/ folder if complexity grows.

### Imports
- Use explicit type imports, e.g. import type { SomeType } from './types'.

### Interfaces vs. Types
- Prefer interface for objects.
- Use type for utility types, unions, or more complex transformations.

## Frontend Rules

### React Components
- Keep each component in its own file if it's large or reused.
- Use functional components with hooks.
- Name them with PascalCase (FlowchartGenerator.jsx).

### Organization
- Put shared components in src/components/ or src/components/ui/ if you have a UI library.
- Feature-specific components can go in subfolders by feature, e.g. src/features/flowchart.

### Data Flow
- Keep data fetching in custom hooks or in a top-level container component.
- Pass data down to child components as props.
- For global states (like user credit or flowchart data), consider using Context or a third-party state manager if the project grows.

### Styling
- Choose your preferred method (CSS modules, styled-components, plain CSS, etc.).
- Keep styles consistent (naming, theming).

### Error States & Loading
- Display clear loading spinners or messages when fetching data.
- Handle error states gracefully (user-friendly messages, etc.).

## Backend Rules

### Express Routes
- Keep route handlers in routes/.
- Import corresponding controllers from controllers/.

### Controllers
- Business logic that processes requests, interacts with services or database, and returns a JSON response.
- Each controller should do minimal logic—offload complex tasks to services.

### Services
- Handle external or internal APIs, e.g., ChatGPT calls (chatgpt-service.js), Stripe calls (stripe-service.js), or Supabase queries (supabase-service.js).
- Each service should return structured results or throw errors, letting controllers handle error responses.

### Middlewares
- Keep cross-cutting concerns (auth checks, logging, error handling) in middlewares/.

### Data Structure
- For user data and credits, store them in Supabase.
- Enforce schema constraints (e.g., free_credit_used, credits, user id).

## Payments (Stripe) Rules

### Payment Flow
- Keep payment endpoints in payment-routes.js.
- The payment-controller.js should handle the main logic (creating payment links, verifying webhooks).

### Credits
- On successful Stripe payment, increment user credits by 1 (or the purchased amount).
- On webhook failure, handle partial or no increments.

### Security
- Verify Stripe webhooks using the signature in production.
- Do not store raw card data—Stripe handles that.

## AI Integration (OpenAI)

### ChatGPT Service
- The chatgpt-service.js handles calls to createChatCompletion.
- Format requests with relevant prompts to produce Mermaid-compatible output.
- Consider partial or follow-up prompts if needed for more accurate diagrams.

### Rate Limits & Retries
- Handle rate limit errors from OpenAI with backoff if the project grows in usage.
- Manage user usage and credits carefully.

## Supabase Rules

### Database
- Keep all database logic in supabase-service.js (or in dedicated services if you prefer multiple).
- Example: getUserById, createUser, updateUserCredits.

### Tables
- For user records, store columns like user_id, free_credit_used, credits.
- If you add more tables (e.g., logs, shareable flowchart links), be consistent in naming (flowchart_links, payment_logs).

### Env Variables
- SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be kept secret (backend only).

### File Storage (if you use Supabase storage)
- Keep bucket names or public URL references in .env.
- Validate file size and type if you implement uploads.

## Error Handling & Logging

### Controllers
Return a clear JSON structure, e.g.:
```json
{ 
  "success": false, 
  "message": "Something went wrong." 
}
```

### Services
- Throw errors with a descriptive message or code if something fails.

### Retries
- If the AI fails, handle up to the allowed number of retries.

### Logs
- In production, log to a service (e.g., console, Datadog, etc.) but do not reveal secrets.

## Security
- HTTPS: Ensure your endpoints are served over HTTPS in production (Render or similar).
- API Keys: Never commit them in code; always use environment variables.
- CORS: Limit Access-Control-Allow-Origin in production to your known frontend domain(s).
- Secrets: Keep them out of client-side code.

## Refund & Retry Logic
- Flowchart Generation: Give the user 10 retries if the AI fails. Track this in Supabase or in-memory.
- Refund: If they still cannot get a diagram, instruct them to email support for manual refunds.

## Final Summary
- Keep a clean folder structure: controllers, routes, services, middlewares in the server/ folder, React code in src/.
- Follow naming conventions (kebab-case) for files, except React components (PascalCase).
- Use environment variables properly in .env & .env.example.
- Handle errors gracefully and consistently.
- Maintain credit logic for free usage vs. paid usage in Supabase.
- Log responsibly, and avoid exposing sensitive info.
- Finish each feature thoroughly (no partial stubs), ensuring each endpoint or UI flow is tested. 