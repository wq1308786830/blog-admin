/**
 * Spin Component Examples
 *
 * This file demonstrates various usage patterns of the Spin component
 * that mimics Ant Design's Spin/Loading functionality.
 */

import { Spin } from './spin'
import { Button } from './button'
import { useState } from 'react'

export function SpinExamples() {
  const [loading, setLoading] = useState(false)

  const handleToggle = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Example 1: Basic Usage */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Basic Usage</h2>
        <div className="flex gap-4">
          <Spin />
          <Spin size="small" />
          <Spin size="large" />
        </div>
      </div>

      {/* Example 2: With Tip */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">With Tip</h2>
        <div className="flex gap-4">
          <Spin tip="Loading..." />
          <Spin tip="Please wait..." size="large" />
        </div>
      </div>

      {/* Example 3: Wrapped Content */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Wrapped Content</h2>
        <Spin spinning={loading}>
          <div className="rounded-lg border p-4">
            <p className="text-sm">
              This is some content that will be covered with a loading overlay
              when the `spinning` prop is true.
            </p>
          </div>
        </Spin>
        <Button onClick={handleToggle}>Toggle Loading</Button>
      </div>

      {/* Example 4: Custom Indicator */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Custom Indicator</h2>
        <Spin
          indicator={
            <div className="flex gap-1">
              <div className="h-3 w-3 animate-bounce rounded-full bg-primary" />
              <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
              <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.4s]" />
            </div>
          }
          tip="Custom loading animation"
        />
      </div>

      {/* Example 5: Delay */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">With Delay (500ms)</h2>
        <Spin spinning={loading} delay={500} tip="Delayed loading" />
        <Button onClick={handleToggle}>Toggle with Delay</Button>
      </div>

      {/* Example 6: Nested Spin */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Nested Spin</h2>
        <Spin spinning={loading} tip="Outer loading">
          <div className="space-y-4 rounded-lg border p-4">
            <p className="text-sm">Outer content area</p>
            <Spin spinning={!loading} tip="Inner loading" size="small">
              <div className="rounded border p-2">
                <p className="text-xs">Inner content area</p>
              </div>
            </Spin>
          </div>
        </Spin>
      </div>
    </div>
  )
}

// ============================================
// Real-world Use Cases
// ============================================

/**
 * Table Loading State
 */
export function TableWithLoading() {
  const [isLoading, setIsLoading] = useState(false)

  const data = [
    { id: 1, name: 'Item 1', status: 'Active' },
    { id: 2, name: 'Item 2', status: 'Inactive' },
    { id: 3, name: 'Item 3', status: 'Active' },
  ]

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsLoading(!isLoading)}>Toggle Loading</Button>
      <Spin spinning={isLoading} tip="Loading data...">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Spin>
    </div>
  )
}

/**
 * Card Loading State
 */
export function CardWithLoading() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <Spin spinning={isLoading} tip="Loading...">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Card Title</h3>
          <p className="text-sm text-muted-foreground">
            This is the card content that will be masked with a loading
            overlay when loading is true.
          </p>
          <div className="flex gap-2">
            <Button size="sm">Action 1</Button>
            <Button size="sm" variant="outline">
              Action 2
            </Button>
          </div>
        </div>
      </Spin>
      <Button
        className="mt-4"
        onClick={() => {
          setIsLoading(true)
          setTimeout(() => setIsLoading(false), 2000)
        }}
      >
        Reload Card
      </Button>
    </div>
  )
}

/**
 * Form Submit Loading
 */
export function FormWithLoading() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  return (
    <div className="max-w-md space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Form Example</h3>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border px-3 py-2"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Spin spinning={isSubmitting} size="small" /> Submit
        </Button>
      </form>
    </div>
  )
}

/**
 * Page Loading State
 */
export function PageWithLoading() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen">
      <Spin
        spinning={isLoading}
        tip="Loading page..."
        size="large"
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      >
        <div className="space-y-6 p-8">
          <h1 className="text-3xl font-bold">Page Content</h1>
          <p className="text-muted-foreground">
            This represents a full page with a loading overlay
          </p>
          {/* Your page content here */}
        </div>
      </Spin>
      <Button
        onClick={() => {
          setIsLoading(true)
          setTimeout(() => setIsLoading(false), 2000)
        }}
      >
        Reload Page
      </Button>
    </div>
  )
}
