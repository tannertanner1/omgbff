import { LOGS } from "@/data/changelog"

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
          {LOGS.map(({ date, logs }) => (
            <section key={date}>
              <h2 className="mb-4 text-xl font-medium">{date}</h2>
              <ul className="text-muted-foreground space-y-3">
                {logs.map((log, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>•</span>
                    <span className="text-pretty">{log}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
