import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { storageAdapter } from "@/lib/storage";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

// 上传文件
export async function POST(request: NextRequest) {
  try {
    verifyAuth(request);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "没有上传文件" }, { status: 400 });
    }

    // 检查文件大小 (限制 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "文件大小不能超过 10MB" },
        { status: 400 },
      );
    }

    // 检查文件类型
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "video/mp4",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
      "application/zip",
      "application/x-rar-compressed"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "不支持的文件类型" }, { status: 400 });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `dropit/${timestamp}.${extension}`;

    // 上传文件使用适配器
    const blob = await storageAdapter.put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      message: "文件上传成功",
      data: {
        url: blob.url,
        size: file.size,
        type: file.type,
        filename: file.name,
        uploadedAt: timestamp,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "上传失败";
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

// 获取文件列表
export async function GET(request: NextRequest) {
  try {
    verifyAuth(request);

    const { blobs } = await storageAdapter.list({
      prefix: "dropit/",
      limit: 50,
    });

    const files = blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      type: blob.pathname ? getFileTypeFromPath(blob.pathname) : 'application/octet-stream',
      filename: blob.pathname ? blob.pathname.split('/').pop() || 'unknown' : 'unknown'
    }));

    function getFileTypeFromPath(pathname: string): string {
      const ext = pathname.split('.').pop()?.toLowerCase() || '';
      const typeMap: { [key: string]: string } = {
        'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif', 'webp': 'image/webp',
        'pdf': 'application/pdf', 'txt': 'text/plain', 'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'mp4': 'video/mp4', 'webm': 'video/webm', 'mp3': 'audio/mpeg', 'wav': 'audio/wav',
        'zip': 'application/zip', 'rar': 'application/x-rar-compressed'
      };
      return typeMap[ext] || 'application/octet-stream';
    }

    return NextResponse.json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error("List files error:", error);
    const message = error instanceof Error ? error.message : "获取文件列表失败";
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

// 删除文件
export async function DELETE(request: NextRequest) {
  try {
    verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "缺少文件 URL" }, { status: 400 });
    }

    await storageAdapter.del(url);

    return NextResponse.json({
      success: true,
      message: "文件删除成功",
    });
  } catch (error) {
    console.error("Delete file error:", error);
    const message = error instanceof Error ? error.message : "删除文件失败";
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
