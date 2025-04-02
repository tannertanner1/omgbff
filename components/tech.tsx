'use client'

import type React from 'react'
import {
  ReactIcon,
  NextjsIcon,
  TypescriptIcon,
  TailwindcssIcon,
  ShadcnIcon,
  MotionIcon,
  DrizzleIcon,
  NeonIcon,
  AuthjsIcon,
  ResendIcon,
  StripeIcon,
  VercelIcon
} from '@/components/icons'

export default function TechStack() {
  type TechItem = {
    name: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    url: string
  }

  const frontendTech: TechItem[] = [
    {
      name: 'React',
      icon: ReactIcon,
      url: 'https://react.dev/'
    },
    {
      name: 'Next.js',
      icon: NextjsIcon,
      url: 'https://nextjs.org/'
    },
    {
      name: 'TypeScript',
      icon: TypescriptIcon,
      url: 'https://www.typescriptlang.org/'
    },
    {
      name: 'Tailwind CSS',
      icon: TailwindcssIcon,
      url: 'https://tailwindcss.com/'
    },
    {
      name: 'Shadcn UI',
      icon: ShadcnIcon,
      url: 'https://ui.shadcn.com/'
    },
    {
      name: 'Motion',
      icon: MotionIcon,
      url: 'https://motion.dev/'
    }
  ]

  const backendTech: TechItem[] = [
    {
      name: 'Auth.js',
      icon: AuthjsIcon,
      url: 'https://authjs.dev/'
    },
    {
      name: 'Neon',
      icon: NeonIcon,
      url: 'https://neon.tech/'
    },
    {
      name: 'Drizzle',
      icon: DrizzleIcon,
      url: 'https://orm.drizzle.team/'
    },
    {
      name: 'Resend',
      icon: ResendIcon,
      url: 'https://resend.com/'
    },
    {
      name: 'Stripe',
      icon: StripeIcon,
      url: 'https://stripe.com/'
    },
    {
      name: 'Vercel',
      icon: VercelIcon,
      url: 'https://vercel.com/'
    }
  ]

  const allTech = [...frontendTech, ...backendTech]

  return (
    <section className='w-full py-12 md:py-24'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center space-y-12'>
          <h2 className='text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
            Built with industry-standard tools
          </h2>

          <div className='w-full max-w-4xl'>
            <div className='grid grid-cols-3 justify-items-center gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-6'>
              {allTech.map(tech => (
                <a
                  key={tech.name}
                  href={tech.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex flex-col items-center gap-2 text-primary hover:underline'
                >
                  <tech.icon className='h-8 w-8 md:h-10 md:w-10' />
                  <span className='text-center font-mono text-xs md:text-sm'>
                    {tech.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 'use client'

// import type React from 'react'
// import {
//   ReactIcon,
//   NextjsIcon,
//   TypescriptIcon,
//   TailwindcssIcon,
//   ShadcnIcon,
//   MotionIcon,
//   DrizzleIcon,
//   NeonIcon,
//   AuthjsIcon,
//   ResendIcon,
//   StripeIcon,
//   VercelIcon
// } from '@/components/icons'

// export default function TechStack() {
//   type TechItem = {
//     name: string
//     icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//     url: string
//   }

//   const frontendTech: TechItem[] = [
//     {
//       name: 'React',
//       icon: ReactIcon,
//       url: 'https://react.dev/'
//     },
//     {
//       name: 'Next.js',
//       icon: NextjsIcon,
//       url: 'https://nextjs.org/'
//     },
//     {
//       name: 'TypeScript',
//       icon: TypescriptIcon,
//       url: 'https://www.typescriptlang.org/'
//     },
//     {
//       name: 'Tailwind CSS',
//       icon: TailwindcssIcon,
//       url: 'https://tailwindcss.com/'
//     },
//     {
//       name: 'Shadcn UI',
//       icon: ShadcnIcon,
//       url: 'https://ui.shadcn.com/'
//     },
//     {
//       name: 'Motion',
//       icon: MotionIcon,
//       url: 'https://motion.dev/'
//     }
//   ]

//   const backendTech: TechItem[] = [
//     {
//       name: 'Auth.js',
//       icon: AuthjsIcon,
//       url: 'https://authjs.dev/'
//     },
//     {
//       name: 'Neon',
//       icon: NeonIcon,
//       url: 'https://neon.tech/'
//     },
//     {
//       name: 'Drizzle',
//       icon: DrizzleIcon,
//       url: 'https://orm.drizzle.team/'
//     },
//     {
//       name: 'Resend',
//       icon: ResendIcon,
//       url: 'https://resend.com/'
//     },
//     {
//       name: 'Stripe',
//       icon: StripeIcon,
//       url: 'https://stripe.com/'
//     },
//     {
//       name: 'Vercel',
//       icon: VercelIcon,
//       url: 'https://vercel.com/'
//     }
//   ]

//   const allTech = [...frontendTech, ...backendTech]

//   return (
//     <section className='w-full py-12 md:py-24'>
//       <div className='container px-4 md:px-6'>
//         <div className='flex flex-col items-center space-y-12'>
//           <h2 className='text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
//             Built with industry-standard tools
//           </h2>

//           <div className='w-full max-w-4xl'>
//             <div className='grid grid-cols-3 justify-items-center gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-6'>
//               {allTech.map(tech => (
//                 <a
//                   key={tech.name}
//                   href={tech.url}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                   className='flex flex-col items-center gap-2 text-primary hover:underline'
//                 >
//                   <tech.icon className='h-8 w-8 md:h-10 md:w-10' />
//                   <span className='text-center font-mono text-xs md:text-sm'>
//                     {tech.name}
//                   </span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
