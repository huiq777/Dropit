# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Remember to testing your work everytime after writing code.

**USE CONTEXT7** (remember for everytime to create code)

## You are a playwright test generator.

You are given a scenario and you need to generate a playwright test for it.
DO NOT generate test code based on the scenario alone.
DO run steps one by one using the tools provided by the Playwright MCP.
Only after all steps are completed, emit a Playwright TypeScript test that uses @playwright/test based on message history
Save generated test file in the tests directory
Execute the test file and iterate until the test passes

**After making a change, test it in the browser at http://localhost:3000
using the Browser MCP. Assume the server is already running.**

## Commands

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production app with Turbopack
- `npm start` - Start production server

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing

- `npm test` - Run Jest tests
- `npm run test:watch` - Run Jest in watch mode
- `npm run test:ci` - Run tests with coverage for CI
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests

### Analysis

- `npm run analyze` - Analyze bundle size (set ANALYZE=true)

## Architecture

This is a **Next.js 15** application using the **App Router** with TypeScript. It's a temporary file sharing service called "Dropit" with password authentication.

### Key Technologies

- **Framework**: Next.js 15 with App Router and React 19
- **Authentication**: JWT with bcrypt for password hashing
- **Storage**: Vercel Blob for file uploads, Vercel KV for metadata
- **State Management**: Zustand for client state
- **Forms**: React Hook Form for form handling
- **Data Fetching**: SWR for client-side data fetching
- **Styling**: Tailwind CSS with custom utility classes
- **Testing**: Jest with React Testing Library, Playwright for E2E

### Project Structure

- `app/` - Next.js App Router pages and API routes
  - `api/auth/` - Authentication endpoint
  - `api/content/` - Content management endpoints
  - `api/upload/` - File upload handling
- `components/` - React components (AuthForm, Clipboard, ImageUpload)
- `lib/` - Utility modules (auth, storage, utils)

### Security Features

- Comprehensive Content Security Policy headers
- Password-protected access with JWT authentication
- Secure file upload handling with type validation
- All security headers configured in next.config.mjs

### Database/Storage Strategy

- **Vercel Blob**: File storage for uploaded images/documents
- **Vercel KV**: Redis-compatible key-value store for content metadata and session data

### Development Notes

- Uses Turbopack for faster builds and development
- Configured for standalone output (optimized for serverless deployment)
- Comprehensive Jest configuration with coverage collection from app/, components/, and lib/ directories
- Security-first approach with strict CSP headers and authentication
