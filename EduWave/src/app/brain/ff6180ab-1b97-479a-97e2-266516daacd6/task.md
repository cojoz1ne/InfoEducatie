# Tasks

- `[x]` Create Mongoose models:
  - `[x]` AIConversation model (`src/models/AIConversation.ts`)
  - `[x]` AIMessage model (`src/models/AIMessage.ts`)
- `[x]` Implement backend API routes:
  - `[x]` Update `POST /api/chat` to verify JWT, save messages, and handle conversations
  - `[x]` Implement `GET /api/chat/conversations` and `DELETE /api/chat/conversations`
  - `[x]` Implement `GET /api/chat/messages`
- `[x]` Refactor frontend AI Assistant page (`src/app/(dashboard)/ai-assistant/page.tsx`) to use the new API routes
- `[x]` Verify AI Assistant functionality manually/locally
