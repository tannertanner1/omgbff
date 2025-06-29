export default async function Page() {
  return (
    <div className="h-fit">
      <div className="mx-auto max-w-5xl p-4 text-wrap">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Terms of service</h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-medium">App use</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using this app, you agree to these terms. Stop using it if you
              disagree.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium">Account access</h2>
            <p className="text-muted-foreground leading-relaxed">
              You&apos;re responsible for your login. Don&apos;t share or misuse
              your account.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium">Acceptable behavior</h2>
            <p className="text-muted-foreground leading-relaxed">
              Use the app lawfully and respectfully. Don&apos;t abuse or disrupt
              it.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium">Legal stuff</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may change or pause the app anytime. Use at your own risk.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
