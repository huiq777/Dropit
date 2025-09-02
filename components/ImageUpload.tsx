'use client'

import { useState, useRef } from 'react'
import useSWR, { mutate } from 'swr'
import Image from 'next/image'

interface UploadedFile {
  url: string
  size: number
  type: string
  filename: string
  uploadedAt: number
}

interface FileListResponse {
  success: boolean
  data: UploadedFile[]
}

const fetcher = async (url: string): Promise<FileListResponse> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  return response.json()
}

export default function ImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, error, isLoading } = useSWR('/api/upload', fetcher)

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 检查文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      showMessage('文件大小不能超过 10MB', 'error')
      return
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
      showMessage('不支持的文件类型', 'error')
      return
    }

    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('文件上传成功', 'success')
        mutate('/api/upload') // 刷新文件列表
        
        // 清空文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        showMessage(result.error || '上传失败', 'error')
      }
    } catch (err) {
      showMessage('网络错误，请重试', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (url: string) => {
    if (!confirm('确定要删除这个文件吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('文件删除成功', 'success')
        mutate('/api/upload') // 刷新文件列表
      } else {
        showMessage(result.error || '删除失败', 'error')
      }
    } catch (err) {
      showMessage('网络错误，请重试', 'error')
    }
  }

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      showMessage('链接已复制到剪贴板', 'success')
    } catch (err) {
      showMessage('复制失败', 'error')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImageFile = (type: string): boolean => {
    return type.startsWith('image/')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        📎 文件上传
      </h2>

      {/* 上传区域 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="fileInput"
          accept="image/*,.pdf,.txt"
        />
        
        <label
          htmlFor="fileInput"
          className={`cursor-pointer block ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="text-4xl mb-4">📁</div>
          <p className="text-lg font-medium text-gray-600 mb-2">
            {isUploading ? '上传中...' : '点击选择文件'}
          </p>
          <p className="text-sm text-gray-500">
            支持图片、PDF、文本文件，最大 10MB
          </p>
        </label>
      </div>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          messageType === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-600'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* 文件列表 */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">已上传的文件</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">加载文件列表失败</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-500">加载中...</p>
          </div>
        )}

        {data?.data && data.data.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">还没有上传任何文件</p>
          </div>
        )}

        {data?.data && data.data.length > 0 && (
          <div className="grid gap-4">
            {data.data.map((file, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {/* 文件预览 */}
                  <div className="flex-shrink-0">
                    {isImageFile(file.type) ? (
                      <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={file.url}
                          alt={file.filename}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                    )}
                  </div>

                  {/* 文件信息 */}
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {file.filename}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString('zh-CN')}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      复制链接
                    </button>
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => handleDelete(file.url)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}