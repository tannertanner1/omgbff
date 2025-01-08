import { Header } from '@/components/header'

export default async function Page() {
  return (
    <main className='mx-auto w-full max-w-5xl flex-grow'>
      <Header />
      <div className='container flex flex-col items-center py-12'>
        {/* ... */}
      </div>
    </main>
  )
}
