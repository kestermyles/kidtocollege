interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-navy h-[220px] flex items-center justify-center mt-[65px]">
      <div className="max-w-4xl w-full mx-auto px-6 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-white/70 mt-2 font-body max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
