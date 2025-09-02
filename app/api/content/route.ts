import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const CONTENT_KEY = 'dropit:content'

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

export async function GET(request: NextRequest) {
  try {
    verifyAuth(request)
    
    const content = await kv.get(CONTENT_KEY) || { text: '', timestamp: Date.now() }
    
    return NextResponse.json({
      success: true,
      data: content
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '服务器错误'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && error.message.includes('未授权') ? 401 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAuth(request)
    
    const { text } = await request.json()
    
    if (typeof text !== 'string') {
      return NextResponse.json(
        { error: '文本内容必须是字符串' },
        { status: 400 }
      )
    }

    const content = {
      text,
      timestamp: Date.now()
    }

    await kv.set(CONTENT_KEY, content)
    
    return NextResponse.json({
      success: true,
      message: '内容已保存',
      data: content
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '服务器错误'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && error.message.includes('未授权') ? 401 : 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    verifyAuth(request)
    
    await kv.del(CONTENT_KEY)
    
    return NextResponse.json({
      success: true,
      message: '内容已清空'
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '服务器错误'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && error.message.includes('未授权') ? 401 : 500 }
    )
  }
}