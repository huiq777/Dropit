import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

describe('AuthForm', () => {
  const mockPush = jest.fn()
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(fetch as jest.Mock).mockClear()
    mockPush.mockClear()
    mockOnSuccess.mockClear()
  })

  it('renders the form correctly', () => {
    render(<AuthForm />)
    
    expect(screen.getByText('🔐 Dropit')).toBeInTheDocument()
    expect(screen.getByText('请输入访问密码')).toBeInTheDocument()
    expect(screen.getByLabelText('访问密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '进入' })).toBeInTheDocument()
  })

  it('shows validation error for empty password', async () => {
    render(<AuthForm />)
    
    const submitButton = screen.getByRole('button', { name: '进入' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('密码不能为空')).toBeInTheDocument()
    })
  })

  it('handles successful authentication', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: '登录成功' }),
    })

    render(<AuthForm />)
    
    const passwordInput = screen.getByLabelText('访问密码')
    const submitButton = screen.getByRole('button', { name: '进入' })
    
    fireEvent.change(passwordInput, { target: { value: 'test-password' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'test-password' }),
      })
    })
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles authentication failure', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: '密码错误' }),
    })

    render(<AuthForm />)
    
    const passwordInput = screen.getByLabelText('访问密码')
    const submitButton = screen.getByRole('button', { name: '进入' })
    
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('密码错误')).toBeInTheDocument()
    })
  })

  it('calls onSuccess callback when provided', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<AuthForm onSuccess={mockOnSuccess} />)
    
    const passwordInput = screen.getByLabelText('访问密码')
    const submitButton = screen.getByRole('button', { name: '进入' })
    
    fireEvent.change(passwordInput, { target: { value: 'test-password' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('handles network error', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<AuthForm />)
    
    const passwordInput = screen.getByLabelText('访问密码')
    const submitButton = screen.getByRole('button', { name: '进入' })
    
    fireEvent.change(passwordInput, { target: { value: 'test-password' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('网络错误，请重试')).toBeInTheDocument()
    })
  })

  it('disables form during submission', async () => {
    ;(fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )

    render(<AuthForm />)
    
    const passwordInput = screen.getByLabelText('访问密码')
    const submitButton = screen.getByRole('button', { name: '进入' })
    
    fireEvent.change(passwordInput, { target: { value: 'test-password' } })
    fireEvent.click(submitButton)
    
    expect(passwordInput).toBeDisabled()
    expect(screen.getByText('验证中...')).toBeInTheDocument()
  })
})