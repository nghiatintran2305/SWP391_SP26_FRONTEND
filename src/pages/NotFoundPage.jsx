import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="soft-card max-w-lg p-8 text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">404</div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-500">The page you are looking for does not exist or may have been moved.</p>
        <Link to="/overview" className="soft-button-primary mt-6">Go to overview</Link>
      </div>
    </div>
  )
}
