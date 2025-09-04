// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 认证相关类型
export interface AuthRequest {
  password: string;
}

export interface AuthResponse {
  authenticated: boolean;
  message?: string;
}

export interface AuthPayload {
  authenticated: boolean;
  iat?: number;
  exp?: number;
}

// 内容管理类型
export interface ContentData {
  text: string;
  timestamp: number;
}

export interface ContentRequest {
  text: string;
}

export interface ContentResponse extends ApiResponse<ContentData> {}

// 文件上传类型
export interface UploadedFile {
  url: string;
  size: number;
  type: string;
  filename: string;
  uploadedAt: number;
}

export interface FileUploadOptions {
  maxSize?: number; // 最大文件大小，字节
  allowedTypes?: string[]; // 允许的文件类型
}

export interface UploadResult {
  success: boolean;
  data?: UploadedFile;
  error?: string;
}

export interface FileListResponse extends ApiResponse<UploadedFile[]> {}

export interface DeleteFileRequest {
  url: string;
}

// 表单数据类型
export interface AuthFormData {
  password: string;
}

export interface ClipboardFormData {
  text: string;
}

// 组件属性类型
export interface AuthFormProps {
  onSuccess?: () => void;
}

export interface ClipboardProps {
  className?: string;
}

export interface ImageUploadProps {
  className?: string;
  onUploadSuccess?: (file: UploadedFile) => void;
  onUploadError?: (error: string) => void;
}

// 通用类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export type MessageType = "success" | "error" | "info" | "warning";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  duration?: number;
  dismissible?: boolean;
}

// HTTP 方法类型
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 环境类型
export type Environment = "development" | "production" | "test";

// 错误类型
export interface AppError extends Error {
  code?: string;
  status?: number;
  details?: any;
}

// 配置类型
export interface AppConfig {
  maxFileSize: number;
  allowedFileTypes: string[];
  jwtSecret: string;
  appPassword: string;
  kvRestApiUrl?: string;
  kvRestApiToken?: string;
  blobReadWriteToken?: string;
}

// SWR 数据获取类型
export interface SWRResponse<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<T | undefined>;
}

// 分页类型
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 搜索和筛选类型
export interface SearchParams {
  query?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}

// 主题类型
export type Theme = "light" | "dark" | "system";

// 语言类型
export type Language = "zh-CN" | "en-US";

// 状态类型
export type LoadingState = "idle" | "loading" | "success" | "error";

// 文件类型枚举
export enum FileType {
  IMAGE = "image",
  PDF = "pdf",
  TEXT = "text",
  OTHER = "other",
}

// 权限类型
export enum Permission {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  ADMIN = "admin",
}

// 日志级别类型
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

// Next.js 相关类型
export interface NextPageProps<T = {}> {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface NextLayoutProps {
  children: React.ReactNode;
  params?: any;
}

export interface NextErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export interface NextLoadingProps {
  children?: React.ReactNode;
}

// 路由类型
export interface Route {
  path: string;
  name: string;
  component?: React.ComponentType;
  isProtected?: boolean;
  permissions?: Permission[];
}

// 菜单项类型
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  isActive?: boolean;
  permissions?: Permission[];
}

// 通知类型
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: MessageType;
  timestamp: number;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "primary" | "secondary";
  }>;
}

// 用户偏好设置类型
export interface UserPreferences {
  theme: Theme;
  language: Language;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    shareUsageData: boolean;
  };
}

// 统计数据类型
export interface Statistics {
  totalFiles: number;
  totalSize: number;
  contentUpdates: number;
  lastActivity: number;
}

// Vercel 特定类型
export interface VercelKVResponse<T = any> {
  result: T;
  error?: string;
}

export interface VercelBlobResponse {
  url: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  size: number;
  uploadedAt: Date;
}

// 扩展全局类型
declare global {
  interface Window {
    __DROPIT_CONFIG__?: Partial<AppConfig>;
  }
}
