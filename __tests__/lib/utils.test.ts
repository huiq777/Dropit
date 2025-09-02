import {
  formatDateTime,
  formatRelativeTime,
  debounce,
  throttle,
  deepClone,
  generateRandomString,
  isValidUrl,
  truncateString,
  slugify,
  isEmpty,
  safeJsonParse,
} from '@/lib/utils'

describe('Utils', () => {
  describe('formatDateTime', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25T15:30:00Z')
      const formatted = formatDateTime(date)
      expect(formatted).toMatch(/2023/)
    })

    it('formats timestamp correctly', () => {
      const timestamp = 1703520600000 // 2023-12-25T15:30:00Z
      const formatted = formatDateTime(timestamp)
      expect(formatted).toMatch(/2023/)
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2023-12-25T15:30:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('returns "刚刚" for recent time', () => {
      const recent = new Date('2023-12-25T15:29:30Z') // 30 seconds ago
      expect(formatRelativeTime(recent)).toBe('刚刚')
    })

    it('returns minutes for recent time', () => {
      const recent = new Date('2023-12-25T15:25:00Z') // 5 minutes ago
      expect(formatRelativeTime(recent)).toBe('5分钟前')
    })

    it('returns hours for older time', () => {
      const recent = new Date('2023-12-25T13:30:00Z') // 2 hours ago
      expect(formatRelativeTime(recent)).toBe('2小时前')
    })

    it('returns days for older time', () => {
      const recent = new Date('2023-12-23T15:30:00Z') // 2 days ago
      expect(formatRelativeTime(recent)).toBe('2天前')
    })
  })

  describe('debounce', () => {
    it('delays function execution', async () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('limits function calls', async () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      await new Promise(resolve => setTimeout(resolve, 150))
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('deepClone', () => {
    it('clones simple objects', () => {
      const original = { a: 1, b: 'test' }
      const cloned = deepClone(original)
      
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
    })

    it('clones nested objects', () => {
      const original = { a: { b: { c: 1 } } }
      const cloned = deepClone(original)
      
      expect(cloned).toEqual(original)
      expect(cloned.a).not.toBe(original.a)
      expect(cloned.a.b).not.toBe(original.a.b)
    })

    it('clones arrays', () => {
      const original = [1, 2, { a: 3 }]
      const cloned = deepClone(original)
      
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned[2]).not.toBe(original[2])
    })

    it('clones dates', () => {
      const original = new Date('2023-12-25')
      const cloned = deepClone(original)
      
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
    })
  })

  describe('generateRandomString', () => {
    it('generates string of specified length', () => {
      const result = generateRandomString(10)
      expect(result).toHaveLength(10)
    })

    it('generates different strings', () => {
      const result1 = generateRandomString(10)
      const result2 = generateRandomString(10)
      expect(result1).not.toBe(result2)
    })

    it('uses custom charset', () => {
      const result = generateRandomString(100, '0123456789')
      expect(result).toMatch(/^[0-9]+$/)
    })
  })

  describe('isValidUrl', () => {
    it('returns true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('https://example.com/path?query=1')).toBe(true)
    })

    it('returns false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('truncateString', () => {
    it('truncates long strings', () => {
      const result = truncateString('This is a very long string', 10)
      expect(result).toBe('This is...')
      expect(result).toHaveLength(10)
    })

    it('returns original string if short enough', () => {
      const original = 'Short'
      const result = truncateString(original, 10)
      expect(result).toBe(original)
    })

    it('uses custom suffix', () => {
      const result = truncateString('This is a very long string', 10, '→')
      expect(result).toBe('This is a→')
    })
  })

  describe('slugify', () => {
    it('converts text to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Hello_World')).toBe('hello-world')
      expect(slugify('Hello-World')).toBe('hello-world')
    })

    it('removes special characters', () => {
      expect(slugify('Hello@World!')).toBe('helloworld')
    })

    it('trims dashes', () => {
      expect(slugify('-Hello World-')).toBe('hello-world')
    })
  })

  describe('isEmpty', () => {
    it('returns true for empty objects', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('returns false for non-empty objects', () => {
      expect(isEmpty({ a: 1 })).toBe(false)
    })
  })

  describe('safeJsonParse', () => {
    it('parses valid JSON', () => {
      const result = safeJsonParse('{"a": 1}', {})
      expect(result).toEqual({ a: 1 })
    })

    it('returns fallback for invalid JSON', () => {
      const fallback = { error: true }
      const result = safeJsonParse('invalid json', fallback)
      expect(result).toBe(fallback)
    })
  })
})