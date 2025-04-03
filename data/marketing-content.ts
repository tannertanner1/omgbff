import type React from 'react'
import {
  IconRosetteDiscountCheck,
  IconFolderHeart,
  IconCoin,
  IconRosetteDiscountCheckFilled,
  IconDashboardFilled,
  IconCashBanknoteFilled
} from '@tabler/icons-react'
import {
  ReactIcon,
  NextjsIcon,
  TypescriptIcon,
  TailwindcssIcon,
  ShadcnIcon,
  MotionIcon,
  AuthjsIcon,
  NeonIcon,
  DrizzleIcon,
  ResendIcon,
  StripeIcon,
  VercelIcon
} from '@/components/landing/icons'

const HERO = {
  title: 'One App. Two Dashboards.',
  description:
    'A client portal your customers actually want. An admin dashboard your team will use. From onboarding to billing — efficiency, without compromise',
  buttonText: 'Get Started',
  buttonUrl: '/login',
  image: 'https://placehold.co/1920x1200/transparent/transparent'
}

const STEPS = {
  title: 'Modern Solutions, Less Overhead',
  description: 'Faster workflows. Less admin. More control.',
  items: [
    {
      title: 'Simplify Onboarding',
      description:
        'Clients sign up using just their email—no passwords, no paper forms. They choose the services they need, make updates anytime, and securely hand off accounts when needed.',
      icon: IconRosetteDiscountCheckFilled,
      image: 'https://placehold.co/1920x1200/transparent/transparent'
    },
    {
      title: 'Streamline Management',
      description:
        'Let clients manage their info, invoices, and groups—all in one place. With built-in activity logs and history, you stay in the loop without lifting a finger.',
      icon: IconDashboardFilled,
      image: 'https://placehold.co/1920x1200/transparent/transparent'
    },
    {
      title: 'Automate Billing',
      description:
        'Invoices send themselves. Payments update automatically. Everything’s tracked, so you can skip the spreadsheets and focus on what matters.',
      icon: IconCashBanknoteFilled,
      image: 'https://placehold.co/1920x1200/transparent/transparent'
    }
  ]
}

type Tech = {
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  url: string
}
const TECH: Tech[] = [
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
  },
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

const DEMOS = {
  title: 'App walkthrough',
  description:
    'Discover the tools and workflows that make managing your accounts and operations simple and efficient.',
  items: [
    {
      title: 'Client Portal',
      description:
        'Easily manage your household and business accounts. Submit income and deduction details, track filings, and handle invoices – all in one place.',
      items: [
        {
          title: 'Creating an account',
          description: 'Quick setup for new users',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Verifying your account',
          description: 'Secure your accounts',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Logging in',
          description: 'Access your client portal',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Adding entities',
          description: 'Manage households and businesses',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Setting up accounts',
          description: 'Organize accounts for each entity',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Sending invites',
          description: 'Manage account access',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Updating account info',
          description: 'Keep details current',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Submitting forms',
          description: 'Provide required information',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Making payments',
          description: 'Handle invoices securely',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        }
      ]
    },
    {
      title: 'Admin Dashboard',
      description:
        'Effortlessly manage operations. From user activity to task management, invoicing, and payroll, discover streamlined workflows to keep the team organized and efficient.',
      items: [
        {
          title: 'Getting started',
          description: 'Admin setup and onboarding',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Exploring features',
          description: 'Overview of admin tools',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Dashboard navigation',
          description: 'Find your way around',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Monitoring user activity',
          description: 'Track entities and accounts',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Sending templates',
          description: 'Communicate with users',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Managing tasks',
          description: 'Streamline workflows',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Organizing worklogs',
          description: 'Log work and set reminders',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Publishing invoices',
          description: 'Process and send invoices',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        },
        {
          title: 'Automating payroll',
          description: 'Simplify financial management',
          videoUrl: '#',
          thumbnailUrl: '/placeholder.svg?height=180&width=320'
        }
      ]
    }
  ]
}

const CTA = {
  title: 'Get started',
  buttons: [
    {
      label: 'GitHub',
      href: 'https://github.com/yourusername/omgbff',
      variant: 'outline',
      icon: 'Github'
    }
  ]
}

export { HERO, STEPS, TECH, DEMOS, CTA }
