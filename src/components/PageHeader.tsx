interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-navy" style={{ height: '180px', marginTop: '65px' }}>
      <div className="h-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-white/70 mt-2 font-body">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
