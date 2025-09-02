import { NextRequest, NextResponse } from 'next/server'
import { put, list, del } from '@vercel/blob'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 验证认证中间件
function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    throw new Error('未授权访问')
  }

  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    throw new Error('认证失效')
  }
}

// 上传文件
export async function POST(request: NextRequest) {
  try {
    verifyAuth(request)
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      )
    }

    // 检查文件大小 (限制 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过 10MB' },
        { status: 400 }
      )
    }

    // 检查文件类型
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'text/plain',
      'application/pdf'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型' },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `dropit/${timestamp}.${extension}`

    // 上传到 Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      data: {
        url: blob.url,
        size: file.size,
        type: file.type,
        filename: file.name,
        uploadedAt: timestamp
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : '上传失败'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && error.message.includes('未授权') ? 401 : 500 }
    )
  }
}

// 获取文件列表
export async function GET(request: NextRequest) {
  try {
    verifyAuth(request)
    
    const { blobs } = await list({
      prefix: 'dropit/',
      limit: 50
    })

    const files = blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt
    }))

    return NextResponse.json({
      success: true,
      data: files
    })
  } catch (error) {
    console.error('List files error:', error)
    const message = error instanceof Error ? error.message : '获取文件列表失败'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && error.message.includes('未授权') ? 401 : 500 }
    )
  }
}

// 删除文件
export async function DELETE(request: NextRequest) {
  try {
    verifyAuth(request)
    
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json(
        { error: '缺少文件 URL' },
        { status: 400 }
      )
    }

    await del(url)

    return NextResponse.json({
      success: true,
      message: '文件删除成功'
    })
  } catch (error) {
    console.error('Delete file error:', error)
    const message = error instanceof Error ? error.message : '删除文件失败'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && error.message.includes('未授权') ? 401 : 500 }
    )
  }
}