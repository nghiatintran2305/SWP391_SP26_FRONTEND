export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Workspace
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate-500 md:text-base">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
    </div>
  )
}
