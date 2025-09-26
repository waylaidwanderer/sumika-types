import { z } from 'zod';

export const TextContentSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});
export type TextContent = z.infer<typeof TextContentSchema>;

export const ResourceContentSchema = z.object({
  type: z.literal('resource'),
  resource: z.object({
    uri: z.string(),
    mimeType: z.string(),
    text: z.string().optional(),
  }),
});
export type ResourceContent = z.infer<typeof ResourceContentSchema>;

export const PromptContentSchema = z.union([TextContentSchema, ResourceContentSchema]);
export type PromptContent = z.infer<typeof PromptContentSchema>;

const BaseMessageSchema = z.object({
  id: z.string(),
});

export const UserMessageSchema = BaseMessageSchema.extend({
  type: z.literal('user'),
  content: z.array(PromptContentSchema),
});
export type UserMessage = z.infer<typeof UserMessageSchema>;

export const AgentMessageSchema = BaseMessageSchema.extend({
  type: z.literal('agent'),
  content: z.string(),
});
export type AgentMessage = z.infer<typeof AgentMessageSchema>;

export const ThoughtMessageSchema = BaseMessageSchema.extend({
  type: z.literal('thought'),
  content: z.string(),
});
export type ThoughtMessage = z.infer<typeof ThoughtMessageSchema>;

export const ToolCallMessageSchema = BaseMessageSchema.extend({
  type: z.literal('tool_call'),
  toolCallId: z.string(),
  kind: z.string(),
  title: z.string(),
  input: z.string(),
  output: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'awaiting_permission', 'cancelled']),
  details: z.object({
    path: z.string().optional(),
    content: z.string().optional(),
    oldContent: z.string().optional(),
    rawContent: z.string().optional(),
  }).optional(),
  requestId: z.number().optional(),
  options: z.array(z.any()).optional(),
  selectedOptionId: z.string().optional(),
});
export type ToolCallMessage = z.infer<typeof ToolCallMessageSchema>;

export const ErrorMessageSchema = BaseMessageSchema.extend({
  type: z.literal('error'),
  error: z.any(),
});
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;

export const HistorySummaryMessageSchema = BaseMessageSchema.extend({
  type: z.literal('history_summary'),
  summary: z.string(),
  after: z.string().optional(),
});
export type HistorySummaryMessage = z.infer<typeof HistorySummaryMessageSchema>;

export const MessageSchema = z.discriminatedUnion('type', [
  UserMessageSchema,
  AgentMessageSchema,
  ThoughtMessageSchema,
  ToolCallMessageSchema,
  ErrorMessageSchema,
  HistorySummaryMessageSchema,
]);
export type Message = z.infer<typeof MessageSchema>;

export const McpServerSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).default([]),
  env: z.record(z.string(), z.string()).default({}),
});
export type McpServer = z.infer<typeof McpServerSchema>;

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  path: z.string(),
  createdAt: z.string().datetime(),
  pinned: z.boolean().default(false),
  env: z.record(z.string(), z.string()).optional(),
  mcpServers: z.record(z.string(), McpServerSchema).default({}),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

export const UpdateWorkspaceSchema = WorkspaceSchema.pick({
  name: true,
  description: true,
  pinned: true,
  env: true,
}).partial().extend({
  mcpServers: z.record(z.string(), McpServerSchema).optional(),
});
export type UpdateWorkspace = z.infer<typeof UpdateWorkspaceSchema>;

export const SessionDataSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  name: z.string(),
  pinned: z.boolean(),
  messages: z.array(MessageSchema),
  lastMessage: MessageSchema.optional(),
  createdAt: z.string().datetime(),
  status: z.enum(['idle', 'thinking', 'awaiting_permission', 'disconnected', 'reinitializing']),
  isNewProcess: z.boolean().optional(),
});
export type SessionData = z.infer<typeof SessionDataSchema>;

export const SettingsSchema = z.object({
  env: z.record(z.string(), z.string()).default({}),
  mcpServers: z.record(z.string(), McpServerSchema).optional().default({}),
  customAcpCommand: z.string().optional(),
});
export type Settings = z.infer<typeof SettingsSchema>;
