import jwt, { SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthPayload {
  authenticated: boolean;
  iat?: number;
  exp?: number;
}

/**
 * 验证用户是否已认证
 * @returns {Promise<boolean>} 认证状态
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return false;
    }

    jwt.verify(token, JWT_SECRET) as AuthPayload;
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取认证令牌信息
 * @returns {Promise<AuthPayload | null>} 令牌信息或null
 */
export async function getAuthToken(): Promise<AuthPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return payload;
  } catch {
    return null;
  }
}

/**
 * 客户端验证函数
 * @returns {Promise<boolean>} 认证状态
 */
export async function verifyClientAuth(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}

/**
 * 客户端登出函数
 * @returns {Promise<boolean>} 操作是否成功
 */
export async function clientLogout(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth", {
      method: "DELETE",
      credentials: "include",
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 生成 JWT 令牌
 * @param {object} payload - 令牌载荷
 * @param {string} expiresIn - 过期时间
 * @returns {string} JWT 令牌
 */
export function generateToken(payload: object, expiresIn = "24h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
}

/**
 * 验证 JWT 令牌
 * @param {string} token - JWT 令牌
 * @returns {AuthPayload | null} 解析的载荷或null
 */
export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}
