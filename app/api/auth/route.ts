import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const APP_PASSWORD = process.env.APP_PASSWORD || "default-password";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }
    
    const body = await request.text();
    if (!body.trim()) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }
    
    const { password } = JSON.parse(body);

    if (!password) {
      return NextResponse.json({ error: "密码不能为空" }, { status: 400 });
    }

    // 验证密码
    const isValid = password === APP_PASSWORD;

    if (!isValid) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    // 生成 JWT token
    const token = jwt.sign({ authenticated: true }, JWT_SECRET, {
      expiresIn: "24h",
    });

    const response = NextResponse.json(
      { success: true, message: "登录成功" },
      { status: 200 },
    );

    // 设置 cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // 验证 JWT token
    jwt.verify(token, JWT_SECRET);

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: "登出成功" },
    { status: 200 },
  );

  // 清除 cookie
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  return response;
}
