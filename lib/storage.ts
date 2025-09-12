import { kv } from "@vercel/kv";
import { put, list, del, PutBlobResult, ListBlobResult } from "@vercel/blob";
import { writeFile, readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';

// KV 存储相关

export interface ContentData {
  text: string;
  timestamp: number;
}

const CONTENT_KEY = "dropit:content";

/**
 * 保存文本内容到 KV 存储
 * @param {string} text - 要保存的文本
 * @returns {Promise<ContentData>} 保存的内容数据
 */
export async function saveContent(text: string): Promise<ContentData> {
  const content: ContentData = {
    text,
    timestamp: Date.now(),
  };

  await kv.set(CONTENT_KEY, content);
  return content;
}

/**
 * 从 KV 存储获取文本内容
 * @returns {Promise<ContentData>} 内容数据
 */
export async function getContent(): Promise<ContentData> {
  const content = await kv.get<ContentData>(CONTENT_KEY);

  if (!content) {
    return {
      text: "",
      timestamp: Date.now(),
    };
  }

  return content;
}

/**
 * 删除 KV 存储中的文本内容
 * @returns {Promise<void>}
 */
export async function deleteContent(): Promise<void> {
  await kv.del(CONTENT_KEY);
}

// Blob 存储相关

export interface FileUploadOptions {
  maxSize?: number; // 最大文件大小，字节
  allowedTypes?: string[]; // 允许的文件类型
}

export interface UploadResult {
  success: boolean;
  data?: {
    url: string;
    size: number;
    type: string;
    filename: string;
    uploadedAt: number;
  };
  error?: string;
}

const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/plain",
  "application/pdf",
];

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * 验证文件是否符合要求
 * @param {File} file - 要验证的文件
 * @param {FileUploadOptions} options - 验证选项
 * @returns {string | null} 错误信息或null
 */
export function validateFile(
  file: File,
  options: FileUploadOptions = {},
): string | null {
  const { maxSize = DEFAULT_MAX_SIZE, allowedTypes = DEFAULT_ALLOWED_TYPES } =
    options;

  // 检查文件大小
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return `文件大小不能超过 ${maxSizeMB}MB`;
  }

  // 检查文件类型
  if (!allowedTypes.includes(file.type)) {
    return "不支持的文件类型";
  }

  return null;
}

/**
 * 上传文件到 Blob 存储
 * @param {File} file - 要上传的文件
 * @param {FileUploadOptions} options - 上传选项
 * @returns {Promise<UploadResult>} 上传结果
 */
export async function uploadFile(
  file: File,
  options: FileUploadOptions = {},
): Promise<UploadResult> {
  try {
    // 验证文件
    const validationError = validateFile(file, options);
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `dropit/${timestamp}.${extension}`;

    // 上传到 Vercel Blob
    const blob: PutBlobResult = await put(filename, file, {
      access: "public",
    });

    return {
      success: true,
      data: {
        url: blob.url,
        size: file.size,
        type: file.type,
        filename: file.name,
        uploadedAt: timestamp,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "上传失败",
    };
  }
}

/**
 * 获取文件列表
 * @param {number} limit - 返回文件数量限制
 * @returns {Promise<ListBlobResult>} 文件列表
 */
export async function getFileList(limit = 50): Promise<ListBlobResult> {
  return await list({
    prefix: "dropit/",
    limit,
  });
}

/**
 * 删除文件
 * @param {string} url - 文件 URL
 * @returns {Promise<boolean>} 是否删除成功
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    await del(url);
    return true;
  } catch (error) {
    console.error("Delete file error:", error);
    return false;
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * 检查是否为图片文件
 * @param {string} mimeType - 文件 MIME 类型
 * @returns {boolean} 是否为图片
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * 获取文件图标
 * @param {string} mimeType - 文件 MIME 类型
 * @returns {string} 文件图标 emoji
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.startsWith("text/")) return "📝";
  return "📁";
}

// Local Storage Fallback for Development

interface BlobLike {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}

class LocalStorage {
  private uploadsDir = join(process.cwd(), 'public', 'uploads');
  private baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3002/uploads' 
    : '/uploads';

  async put(filename: string, file: File): Promise<BlobLike> {
    const safePath = filename.replace(/\.\./g, '').replace(/^\/+/, '');
    const fullPath = join(this.uploadsDir, safePath);
    
    // Ensure directory exists
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    await this.ensureDir(dir);
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await writeFile(fullPath, buffer);
    
    const stats = await stat(fullPath);
    const url = `${this.baseUrl}/${safePath}`;
    
    return {
      url,
      pathname: safePath,
      size: stats.size,
      uploadedAt: stats.mtime
    };
  }

  async list(options: { prefix?: string; limit?: number } = {}): Promise<{ blobs: BlobLike[] }> {
    try {
      await this.ensureDir(this.uploadsDir);
      const blobs: BlobLike[] = [];
      
      // Use a recursive function to handle directory traversal manually
      const processDirectory = async (currentDir: string, baseDir: string) => {
        const entries = await readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(currentDir, entry.name);
          
          if (entry.isDirectory()) {
            // Recursively process subdirectories
            await processDirectory(fullPath, baseDir);
          } else if (entry.isFile()) {
            // Create relative path from base directory
            const relativePath = fullPath
              .replace(baseDir, '')
              .replace(/\\/g, '/')
              .replace(/^\//, '');
            
            if (options.prefix && !relativePath.startsWith(options.prefix)) {
              continue;
            }
            
            const stats = await stat(fullPath);
            const url = `${this.baseUrl}/${relativePath}`;
            
            blobs.push({
              url,
              pathname: relativePath,
              size: stats.size,
              uploadedAt: stats.mtime
            });
          }
        }
      };
      
      await processDirectory(this.uploadsDir, this.uploadsDir);
      
      // Sort by upload date (newest first)
      blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      
      if (options.limit) {
        return { blobs: blobs.slice(0, options.limit) };
      }
      
      return { blobs };
    } catch (error) {
      console.error('Error listing local files:', error);
      return { blobs: [] };
    }
  }

  async del(url: string): Promise<void> {
    const pathname = url.replace(this.baseUrl + '/', '');
    const fullPath = join(this.uploadsDir, pathname);
    
    try {
      await unlink(fullPath);
    } catch (error) {
      console.error('Error deleting local file:', error);
      throw new Error('Failed to delete file');
    }
  }

  private async ensureDir(dir: string): Promise<void> {
    try {
      await stat(dir);
    } catch {
      const { mkdir } = await import('fs/promises');
      await mkdir(dir, { recursive: true });
    }
  }
}

// Enhanced storage adapter with fallback
export const storageAdapter = {
  async put(filename: string, file: File, options: { access: "public" }): Promise<BlobLike> {
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
      try {
        const result = await put(filename, file as any, options);
        return {
          url: result.url,
          pathname: result.pathname,
          size: file.size,
          uploadedAt: new Date()
        };
      } catch (error) {
        console.warn('Vercel Blob upload failed, falling back to local storage:', error);
        const localStorage = new LocalStorage();
        return await localStorage.put(filename, file);
      }
    } else {
      console.log('Using local storage for development');
      const localStorage = new LocalStorage();
      return await localStorage.put(filename, file);
    }
  },

  async list(options: { prefix?: string; limit?: number } = {}): Promise<{ blobs: BlobLike[] }> {
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
      try {
        return await list(options);
      } catch (error) {
        console.warn('Vercel Blob list failed, falling back to local storage:', error);
        const localStorage = new LocalStorage();
        return await localStorage.list(options);
      }
    } else {
      console.log('Using local storage for development');
      const localStorage = new LocalStorage();
      return await localStorage.list(options);
    }
  },

  async del(url: string): Promise<void> {
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
      try {
        await del(url);
        return;
      } catch (error) {
        console.warn('Vercel Blob delete failed, falling back to local storage:', error);
      }
    }
    
    console.log('Using local storage for development');
    const localStorage = new LocalStorage();
    await localStorage.del(url);
  }
};
