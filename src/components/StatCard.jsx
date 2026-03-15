export default function StatCard({ label, value, hint }) {
  return (
    <div className="metric-tile">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</h3>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </div>
  )
}
