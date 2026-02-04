/**
 * Input Component Examples
 *
 * Comprehensive examples demonstrating all Input component variants and features.
 */

import { useState } from 'react'
import { Input, TextArea, Search, Password, OTP } from './input'
import { Button } from './button'
import { Mail, Lock, Search as SearchIcon, User, DollarSign } from 'lucide-react'

export function InputExamples() {
  return (
    <div className="flex flex-col gap-12 p-8 max-w-4xl">
      {/* ============================================
          Basic Input Examples
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Input</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Default Input</label>
            <Input placeholder="Enter text..." />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">With Placeholder</label>
            <Input placeholder="username@example.com" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Disabled Input</label>
            <Input disabled placeholder="Disabled input" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Readonly Input</label>
            <Input readOnly value="Readonly value" />
          </div>
        </div>
      </section>

      {/* ============================================
          Sizes
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Input Sizes</h2>
        <div className="space-y-3">
          <Input size="small" placeholder="Small size" />
          <Input size="middle" placeholder="Middle (default) size" />
          <Input size="large" placeholder="Large size" />
        </div>
      </section>

      {/* ============================================
          Variants
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Input Variants</h2>
        <div className="space-y-3">
          <Input variant="outlined" placeholder="Outlined variant" />
          <Input variant="filled" placeholder="Filled variant" />
          <Input variant="borderless" placeholder="Borderless variant" />
          <Input variant="underlined" placeholder="Underlined variant" />
        </div>
      </section>

      {/* ============================================
          Prefix and Suffix
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Prefix and Suffix</h2>
        <div className="space-y-3">
          <Input prefix={<User className="h-4 w-4" />} placeholder="Username" />
          <Input suffix=".com" placeholder="website" />
          <Input
            prefix={<Mail className="h-4 w-4" />}
            suffix="@example.com"
            placeholder="email"
          />
          <Input
            prefix={<DollarSign className="h-4 w-4" />}
            placeholder="0.00"
          />
        </div>
      </section>

      {/* ============================================
          Clear Button
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Clear Button</h2>
        <div className="space-y-3">
          <Input allowClear placeholder="Input with clear button" />
          <Input
            allowClear
            defaultValue="Clear me"
            placeholder="Type something..."
          />
        </div>
      </section>

      {/* ============================================
          Character Count
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Character Count</h2>
        <div className="space-y-3">
          <Input showCount placeholder="Input with character count" />
          <Input
            showCount
            maxLength={20}
            placeholder="Max 20 characters"
          />
          <Input
            showCount={({ count, maxLength }) => (
              <span className={count > 15 ? 'text-destructive' : ''}>
                {count} / {maxLength}
              </span>
            )}
            maxLength={20}
            placeholder="Custom count formatter"
          />
        </div>
      </section>

      {/* ============================================
          Status
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Input Status</h2>
        <div className="space-y-3">
          <Input status="error" placeholder="Error state" />
          <Input status="warning" placeholder="Warning state" />
          <Input status="error" defaultValue="Invalid input" />
        </div>
      </section>

      {/* ============================================
          TextArea
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">TextArea</h2>
        <div className="space-y-3">
          <TextArea placeholder="Basic textarea" rows={4} />
          <TextArea
            showCount
            maxLength={200}
            placeholder="Textarea with character count"
            rows={4}
          />
          <TextArea
            autoSize
            placeholder="Auto resizing textarea"
            defaultValue="Line 1\nLine 2\nLine 3"
          />
          <TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="Auto resize with min and max rows"
            defaultValue="Line 1\nLine 2\nLine 3"
          />
        </div>
      </section>

      {/* ============================================
          Search Input
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Search Input</h2>
        <div className="space-y-3">
          <Search placeholder="Search..." />
          <Search enterButton placeholder="Search with button" />
          <Search
            enterButton="Search"
            placeholder="Custom button text"
          />
          <Search
            loading
            placeholder="Loading search..."
          />
        </div>
      </section>

      {/* ============================================
          Password Input
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Password Input</h2>
        <div className="space-y-3">
          <Password placeholder="Enter password" />
          <Password
            prefix={<Lock className="h-4 w-4" />}
            placeholder="Password with prefix"
          />
          <Password
            visibilityToggle={false}
            placeholder="Password without toggle"
          />
        </div>
      </section>

      {/* ============================================
          OTP Input
      ============================================ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">OTP Input</h2>
        <div className="space-y-3">
          <OTP />
          <OTP length={4} />
          <OTP mask />
          <OTP separator="-" />
          <OTP
            formatter={(value) => value.toUpperCase()}
            length={6}
          />
        </div>
      </section>
    </div>
  )
}

// ============================================
// Real-world Examples
// ============================================

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="max-w-md space-y-4 rounded-lg border p-6">
      <h2 className="text-xl font-bold">Login Form</h2>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          prefix={<Mail className="h-4 w-4" />}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Password
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Login'}
      </Button>
    </div>
  )
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = (value: string) => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="max-w-2xl">
      <Search
        placeholder="Search articles, categories..."
        enterButton
        loading={loading}
        onSearch={handleSearch}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        allowClear
      />
    </div>
  )
}

export function CommentBox() {
  const [comment, setComment] = useState('')

  return (
    <div className="max-w-2xl space-y-2">
      <label className="text-sm font-medium">Add a comment</label>
      <TextArea
        showCount
        maxLength={500}
        placeholder="Write your comment here..."
        autoSize={{ minRows: 4, maxRows: 8 }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex justify-end">
        <Button>Post Comment</Button>
      </div>
    </div>
  )
}

export function UrlInput() {
  const [url, setUrl] = useState('')

  return (
    <div className="max-w-md space-y-2">
      <label className="text-sm font-medium">Website URL</label>
      <Input
        prefix="https://"
        suffix=".com"
        placeholder="example"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </div>
  )
}

export function PriceInput() {
  const [price, setPrice] = useState('')

  return (
    <div className="max-w-md space-y-2">
      <label className="text-sm font-medium">Price</label>
      <Input
        type="number"
        prefix={<DollarSign className="h-4 w-4" />}
        placeholder="0.00"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </div>
  )
}

export function OTPVerification() {
  const [otp, setOtp] = useState('')

  const handleOTPChange = (value: string) => {
    setOtp(value)
    console.log('OTP entered:', value)
  }

  return (
    <div className="flex flex-col items-center space-y-4 rounded-lg border p-8">
      <h3 className="text-lg font-semibold">Verify OTP</h3>
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to your phone
      </p>
      <OTP
        length={6}
        mask
        onChange={handleOTPChange}
        size="large"
      />
    </div>
  )
}

export function FormWithValidation() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({
    username: false,
    email: false,
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleBlur = (field: 'username' | 'email') => {
    if (field === 'username') {
      setErrors({ ...errors, username: username.length < 3 })
    }
    if (field === 'email') {
      setErrors({ ...errors, email: !validateEmail(email) })
    }
  }

  return (
    <div className="max-w-md space-y-4 rounded-lg border p-6">
      <h2 className="text-xl font-bold">Registration Form</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input
          placeholder="Min 3 characters"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => handleBlur('username')}
          status={errors.username ? 'error' : undefined}
          showCount
          maxLength={20}
          prefix={<User className="h-4 w-4" />}
        />
        {errors.username && (
          <p className="text-xs text-destructive">
            Username must be at least 3 characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          status={errors.email ? 'error' : undefined}
          prefix={<Mail className="h-4 w-4" />}
        />
        {errors.email && (
          <p className="text-xs text-destructive">Please enter a valid email</p>
        )}
      </div>

      <Button className="w-full">Register</Button>
    </div>
  )
}

export function BioTextArea() {
  const [bio, setBio] = useState('')

  return (
    <div className="max-w-2xl space-y-2">
      <label className="text-sm font-medium">Bio</label>
      <TextArea
        showCount={({ count, maxLength }) => (
          <span className={count > 150 ? 'text-destructive' : ''}>
            {count} / {maxLength}
          </span>
        )}
        maxLength={200}
        placeholder="Tell us about yourself..."
        autoSize={{ minRows: 4, maxRows: 8 }}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        status={bio.length > 150 ? 'warning' : undefined}
      />
      <p className="text-xs text-muted-foreground">
        Write a short bio. Keep it under 200 characters.
      </p>
    </div>
  )
}
