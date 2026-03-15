export default function StatCard({ label, value, hint }) {
  return (
    <div className="soft-card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}