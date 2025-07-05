export default async function Page() {
  return (
    <div className="h-fit">
      <div className="mx-auto max-w-5xl p-4 text-wrap">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Changelog</h1>
            <p className="text-muted-foreground mt-2">
              Latest updates and announcements
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-medium">June 2025</h2>
            <ul className="text-muted-foreground space-y-3">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span className="text-pretty">Open-sourced omgbff.com</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
