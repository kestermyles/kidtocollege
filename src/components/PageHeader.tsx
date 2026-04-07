interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-navy pt-20 pb-14 mt-[65px]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-white/60 mt-2 font-body">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
