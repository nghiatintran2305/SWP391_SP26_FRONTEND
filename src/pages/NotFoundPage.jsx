import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="soft-card max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-slate-600">Page này không tồn tại nha.</p>
        <Link to="/" className="soft-button-primary mt-5">Back to login</Link>
      </div>
    </div>
  )
}