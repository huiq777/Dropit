import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并和处理 CSS 类名
 * @param {...ClassValue[]} inputs - CSS 类名
 * @returns {string} 处理后的 CSS 类名
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期时间
 * @param {number | string | Date} date - 日期
 * @param {string} locale - 区域设置
 * @returns {string} 格式化的日期时间字符串
 */
export function formatDateTime(
  date: number | string | Date, 
  locale = 'zh-CN'
): string {
  const dateObj = new Date(date)
  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * 格式化相对时间
 * @param {number | string | Date} date - 日期
 * @param {string} locale - 区域设置
 * @returns {string} 相对时间字符串
 */
export function formatRelativeTime(
  date: number | string | Date,
  locale = 'zh-CN'
): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}天前`
  }

  // 超过7天显示具体日期
  return formatDateTime(date, locale)
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 深拷贝对象
 * @param {T} obj - 要拷贝的对象
 * @returns {T} 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @param {string} charset - 字符集
 * @returns {string} 随机字符串
 */
export function generateRandomString(
  length = 8,
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

/**
 * 检查是否为有效的 URL
 * @param {string} string - 要检查的字符串
 * @returns {boolean} 是否为有效 URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

/**
 * 截断字符串
 * @param {string} str - 原字符串
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀
 * @returns {string} 截断后的字符串
 */
export function truncateString(
  str: string, 
  maxLength: number, 
  suffix = '...'
): string {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength - suffix.length) + suffix
}

/**
 * 转换为 slug 格式
 * @param {string} text - 原文本
 * @returns {string} slug 格式的字符串
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为破折号
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的破折号
}

/**
 * 检查对象是否为空
 * @param {object} obj - 要检查的对象
 * @returns {boolean} 是否为空对象
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}

/**
 * 安全地解析 JSON
 * @param {string} str - JSON 字符串
 * @param {any} fallback - 解析失败时的回退值
 * @returns {any} 解析结果或回退值
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

/**
 * 延迟执行
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise<void>} Promise 对象
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 获取环境变量（带默认值）
 * @param {string} key - 环境变量键
 * @param {string} defaultValue - 默认值
 * @returns {string} 环境变量值或默认值
 */
export function getEnvVar(key: string, defaultValue = ''): string {
  return process.env[key] || defaultValue
}

/**
 * 检查是否为开发环境
 * @returns {boolean} 是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * 检查是否为生产环境
 * @returns {boolean} 是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}