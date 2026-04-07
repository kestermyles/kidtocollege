interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-navy pt-28 pb-10">
      <div className="max-w-5xl mx-auto px-6">
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
