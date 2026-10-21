export type TabType = 
  | 'chat'
  | 'research'
  | 'work'
  | 'agents'
  | 'image'
  | 'video'
  | 'design'
  | 'docs'
  | 'slides'
  | 'sheets'
  | 'code'
  | 'voice'
  | 'projects'
  | 'templates'
  | 'integrations'
  | 'billing'
  | 'settings'
  | 'admin';

export type ReasoningMode = 'fast' | 'balanced' | 'deep';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoningMode?: ReasoningMode;
  reasoningTrace?: string;
  timestamp: string;
  model: string;
  attachments?: Array<{ name: string; size: string; type: string }>;
  citations?: Array<{ title: string; url: string; snippet: string }>;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  model: string;
  folderId?: string;
  isPinned?: boolean;
}

export interface AgentStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval';
  log?: string;
  duration?: string;
}

export interface AgentDeliverable {
  id: string;
  title: string;
  type: 'document' | 'chart' | 'code' | 'report' | 'file';
  content: string;
  downloadName: string;
}

export interface WorkJob {
  id: string;
  title: string;
  prompt: string;
  category: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  progress: number;
  steps: AgentStep[];
  deliverables: AgentDeliverable[];
  createdAt: string;
  agentName: string;
}

export interface CustomAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  systemPrompt: string;
  tools: string[];
  capabilities: string[];
  activeRuns: number;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'image' | 'sticker' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  src?: string;
  zIndex: number;
  isLocked?: boolean;
}

export interface DesignProject {
  id: string;
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
  updatedAt: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  resolution: string;
  imageUrl: string;
  createdAt: string;
  liked?: boolean;
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  title: string;
  narration: string;
  visualPrompt: string;
  duration: number; // in seconds
  status: 'pending' | 'generating' | 'ready';
  videoPreviewUrl?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  scenes: VideoScene[];
  status: 'draft' | 'rendering' | 'completed';
  totalDuration: number;
  createdAt: string;
}

export interface DocItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  category: string;
  wordCount: number;
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  speakerNotes: string;
  backgroundTheme: string;
}

export interface PresentationProject {
  id: string;
  title: string;
  theme: string;
  slides: SlideItem[];
  updatedAt: string;
}

export interface SheetCell {
  raw: string;
  computed: string;
}

export interface SpreadsheetProject {
  id: string;
  name: string;
  cols: string[];
  rows: number;
  data: Record<string, SheetCell>;
  chartConfig?: {
    type: 'bar' | 'line' | 'pie';
    labelCol: string;
    valueCol: string;
  };
  updatedAt: string;
}

export interface CodeProject {
  id: string;
  name: string;
  language: string;
  files: Record<string, string>;
  activeFile: string;
}

export interface SubscriptionPlan {
  id: 'plus' | 'pro' | 'ultra';
  name: string;
  tagline: string;
  priceMonthlyINR: number;
  priceAnnualINR: number;
  gstRate: number;
  features: string[];
  highlight?: boolean;
  limits: {
    models: string;
    aiWorkPerMonth: string;
    imagePerMonth: string;
    videoPerMonth: string;
    storageGB: number;
  };
}

export interface UserSubscription {
  planId: 'plus' | 'pro' | 'ultra';
  cycle: 'monthly' | 'annual';
  status: 'active' | 'trial';
  renewalDate: string;
  gstin?: string;
  businessName?: string;
}
