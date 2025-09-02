'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

interface ClipboardData {
  text: string
  timestamp: number
}

interface ClipboardFormData {
  text: string
}

const fetcher = async (url: string): Promise<{ success: boolean; data: ClipboardData }> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  return response.json()
}

export default function Clipboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const { data, error, isLoading: isLoadingData } = useSWR('/api/content', fetcher)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ClipboardFormData>()

  const textValue = watch('text')

  useEffect(() => {
    if (data?.data?.text) {
      setValue('text', data.data.text)
    }
  }, [data, setValue])

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  const handleSave = async (formData: ClipboardFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: formData.text }),
      })

      const result = await response.json()
      
      if (response.ok) {
        showMessage('内容已保存', 'success')
        mutate('/api/content') // 刷新数据
      } else {
        showMessage(result.error || '保存失败', 'error')
      }
    } catch (err) {
      showMessage('网络错误，请重试', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = async () => {
    if (!confirm('确定要清空所有内容吗？')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/content', {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (response.ok) {
        setValue('text', '')
        showMessage('内容已清空', 'success')
        mutate('/api/content') // 刷新数据
      } else {
        showMessage(result.error || '清空失败', 'error')
      }
    } catch (err) {
      showMessage('网络错误，请重试', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!textValue) {
      showMessage('没有内容可复制', 'error')
      return
    }

    try {
      await navigator.clipboard.writeText(textValue)
      showMessage('已复制到剪贴板', 'success')
    } catch (err) {
      showMessage('复制失败', 'error')
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">加载失败，请刷新页面</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          📝 文本剪贴板
        </h2>
        {data?.data?.timestamp && (
          <p className="text-sm text-gray-500">
            最后更新: {new Date(data.data.timestamp).toLocaleString('zh-CN')}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
        <div>
          <textarea
            {...register('text', {
              maxLength: { value: 10000, message: '内容不能超过 10000 字符' }
            })}
            placeholder="在此输入或粘贴文本..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            disabled={isLoading || isLoadingData}
          />
          
          <div className="flex justify-between items-center mt-2">
            <div>
              {errors.text && (
                <p className="text-sm text-red-600">
                  {errors.text.message}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {textValue?.length || 0} / 10000
            </p>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || isLoadingData}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? '保存中...' : '💾 保存'}
          </button>
          
          <button
            type="button"
            onClick={handleCopy}
            disabled={isLoading || !textValue}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📋 复制
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            🗑️ 清空
          </button>
        </div>
      </form>
    </div>
  )
}