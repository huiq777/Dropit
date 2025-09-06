import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const CONTENT_KEY = "dropit:content";
const MESSAGES_KEY = "dropit:messages";

// Check if Vercel KV is available
let kv: any = null;
let kvAvailable = false;

try {
  // Only import and initialize KV if environment variables are present
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv: kvClient } = require("@vercel/kv");
    kv = kvClient;
    kvAvailable = true;
  }
} catch (error) {
  console.log("Vercel KV not available, using fallback storage");
  kvAvailable = false;
}

// Fallback in-memory storage for development
let memoryStorage: { [key: string]: any } = {};

// Storage helpers
async function getFromStorage<T>(key: string): Promise<T | null> {
  if (kvAvailable && kv) {
    try {
      return (await kv.get(key)) as T;
    } catch (error) {
      console.log(`KV get error for ${key}:`, error);
      // Fall back to memory storage
    }
  }
  return memoryStorage[key] || null;
}

async function setInStorage(key: string, value: any): Promise<void> {
  if (kvAvailable && kv) {
    try {
      await kv.set(key, value);
      return;
    } catch (error) {
      console.log(`KV set error for ${key}:`, error);
      // Fall back to memory storage
    }
  }
  memoryStorage[key] = value;
}

async function deleteFromStorage(key: string): Promise<void> {
  if (kvAvailable && kv) {
    try {
      await kv.del(key);
      return;
    } catch (error) {
      console.log(`KV delete error for ${key}:`, error);
      // Fall back to memory storage
    }
  }
  delete memoryStorage[key];
}

interface Message {
  id: string;
  type: "text" | "file";
  content: string;
  timestamp: number;
  fileData?: {
    url: string;
    filename: string;
    size: number;
    type: string;
  };
}

// 验证认证中间件
function verifyAuth(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    throw new Error("未授权访问");
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    throw new Error("认证失效");
  }
}

export async function GET(request: NextRequest) {
  try {
    verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "messages") {
      // Get chat messages history
      const messages = (await getFromStorage<Message[]>(MESSAGES_KEY)) || [];
      return NextResponse.json({
        success: true,
        data: messages.sort((a, b) => a.timestamp - b.timestamp), // Sort by timestamp
        storage: kvAvailable ? "vercel-kv" : "memory", // Add storage info for debugging
      });
    }

    // Default: get current content (backwards compatibility)
    const content = (await getFromStorage(CONTENT_KEY)) || {
      text: "",
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: content,
      storage: kvAvailable ? "vercel-kv" : "memory", // Add storage info for debugging
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "服务器错误";
    return NextResponse.json(
      { error: message },
      {
        status:
          error instanceof Error && error.message.includes("未授权")
            ? 401
            : 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAuth(request);

    const body = await request.json();

    if (body.type === "message") {
      // Add message to chat history
      const { content, messageType = "text", fileData } = body;

      if (!content || typeof content !== "string") {
        return NextResponse.json(
          { error: "消息内容不能为空" },
          { status: 400 },
        );
      }

      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: messageType,
        content,
        timestamp: Date.now(),
        fileData,
      };

      // Get existing messages and add new one
      const messages = (await getFromStorage<Message[]>(MESSAGES_KEY)) || [];
      messages.push(newMessage);

      // Keep only last 100 messages to prevent storage bloat
      const recentMessages = messages.slice(-100);
      await setInStorage(MESSAGES_KEY, recentMessages);

      return NextResponse.json({
        success: true,
        message: "消息已添加",
        data: newMessage,
      });
    }

    // Default: legacy text content handling (backwards compatibility)
    const { text } = body;

    if (typeof text !== "string") {
      return NextResponse.json(
        { error: "文本内容必须是字符串" },
        { status: 400 },
      );
    }

    const content = {
      text,
      timestamp: Date.now(),
    };

    await setInStorage(CONTENT_KEY, content);

    return NextResponse.json({
      success: true,
      message: "内容已保存",
      data: content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "服务器错误";
    return NextResponse.json(
      { error: message },
      {
        status:
          error instanceof Error && error.message.includes("未授权")
            ? 401
            : 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "messages") {
      // Clear chat messages
      await deleteFromStorage(MESSAGES_KEY);
      return NextResponse.json({
        success: true,
        message: "聊天记录已清空",
      });
    }

    // Default: clear content (backwards compatibility)
    await deleteFromStorage(CONTENT_KEY);

    return NextResponse.json({
      success: true,
      message: "内容已清空",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "服务器错误";
    return NextResponse.json(
      { error: message },
      {
        status:
          error instanceof Error && error.message.includes("未授权")
            ? 401
            : 500,
      },
    );
  }
}
