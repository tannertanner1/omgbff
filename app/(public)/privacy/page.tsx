export default async function Page() {
  return (
    <div className="h-fit">
      <div className="mx-auto max-w-5xl p-4 text-wrap">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Privacy policy</h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-medium">Data collection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect your email when you sign in. We may log usage data to
              improve the app.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium">Data usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is used only to power app functionality, like login and
              managing your account.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium">Data protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use trusted services like Resend, Auth.js, and Neon for secure
              auth and storage.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium">Your rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can update or delete your data anytime by logging in. No data
              is sold or shared.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
