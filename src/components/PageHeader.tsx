interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section
      className="bg-navy"
      style={{ height: '200px', marginTop: '65px' }}
    >
      <div className="h-full flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-white/70 mt-3 font-body max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
