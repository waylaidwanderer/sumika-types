# @waylaidwanderer/sumika-types

This package provides the core TypeScript types and Zod schemas for [Sumika](https://github.com/waylaidwanderer/sumika), a stateful API server for agents compatible with the Agent Client Protocol (ACP).

This package is distributed separately from the main Sumika server to allow third-party developers to build their own clients or integrations. The official web UI, [Utsuwa](https://github.com/waylaidwanderer/utsuwa), serves as a first-party reference implementation and uses this package for all type definitions.

## Installation

```bash
pnpm add @waylaidwanderer/sumika-types
```

## Usage

You can import the Zod schemas to validate data from the Sumika API or to infer TypeScript types for your client application.

```typescript
import { SessionDataSchema, type SessionData } from '@waylaidwanderer/sumika-types';

// Example function to validate a session object from the API
async function fetchAndValidateSession(sessionId: string): Promise<SessionData | null> {
  const response = await fetch(`http://localhost:8787/api/sessions/${sessionId}`);
  const data = await response.json();

  const result = SessionDataSchema.safeParse(data);
  if (result.success) {
    console.log('Valid session:', result.data.id);
    return result.data;
  } else {
    console.error('Invalid session data from API:', result.error);
    return null;
  }
}

// The inferred TypeScript type can be used to build your client UI
const mySession: SessionData = {
  id: 'session-123',
  workspaceId: 'default-workspace',
  name: 'My Session',
  pinned: false,
  messages: [],
  createdAt: new Date().toISOString(),
  status: 'idle',
};
```

## Available Schemas

This package includes Zod schemas for all major data structures used by the Sumika API, including:

-   `MessageSchema` (and its variants like `UserMessageSchema`, `AgentMessageSchema`, etc.)
-   `WorkspaceSchema`
-   `SessionDataSchema`
-   `SettingsSchema`
-   And more.

Refer to the `src/index.ts` file for a complete list of all exported types and schemas.

## License

MIT
