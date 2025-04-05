import type React from 'react'
import {
  IconRosetteDiscountCheckFilled,
  IconClockFilled,
  IconCoinFilled
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
  // section: '🚀 Announcing public beta',
  title: 'One app. Two dashboards.',
  description:
    'A client portal your customers actually want. An admin dashboard your team will use. From seamless onboarding to effortless invoicing.',
  link: '/login',
  button: 'Get started',
  image: 'https://placehold.co/1920x1200/transparent/transparent'
}

const STEPS = {
  title: 'Modern solutions, less overhead.',
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
      icon: IconClockFilled,
      image: 'https://placehold.co/1920x1200/transparent/transparent'
    },
    {
      title: 'Automate Billing',
      description:
        'Invoices send themselves. Payments update automatically. Everything’s tracked, so you can skip the spreadsheets and focus on what matters.',
      icon: IconCoinFilled,
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
  // section: 'Everything you need',
  // title: 'Built with industry standard tools',
  // description: '',
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
  // section: 'Feature walkthrough roadmap',
  title: 'Shipped and shipping',
  description:
    'Discover the tools and workflows that make managing your accounts and operations simple and efficient.',
  items: [
    {
      title: 'Client Portal',
      description:
        'Manage individual and business accounts, oversee services, and handle invoices through a secure, centralized portal.',
      items: [
        {
          status: '',
          title: 'Creating an account',
          description: 'Quick setup for new users',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Logging in',
          description: 'Access your client portal',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Adding entities',
          description: 'Manage individuals and businesses',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Setting up accounts',
          description: 'Organize by client or service type',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Sending invites',
          description: 'Share access with collaborators',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Updating account info',
          description: 'Keep details accurate and up to date',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Submitting forms',
          description: 'Request a service or upload info',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Making payments',
          description: 'Review and pay invoices securely',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        }
      ]
    },
    {
      title: 'Admin Dashboard',
      description:
        'Manage users, track work, and send invoices with full visibility across your operations.',
      items: [
        {
          status: '',
          title: 'Getting started',
          description: 'Set up your team and workspace',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Dashboard overview',
          description: 'Navigate and access tools fast',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Monitoring user activity',
          description: 'Track accounts and service usage',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Sending templates',
          description: 'Send forms, messages, and updates',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Managing tasks',
          description: 'Trigger and track internal work',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Organizing worklogs',
          description: 'Keep notes and log activity',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Publishing invoices',
          description: 'Create and send client invoices',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        },
        {
          status: '',
          title: 'Managing payments',
          description: 'Track payment status and history',
          video: '#',
          thumbnail: 'https://placehold.co/180x320/transparent/transparent'
        }
      ]
    }
  ]
}

const CTA = {
  // section: 'Get started faster',
  title: '100% open-source & free',
  description: '',
  buttons: [
    {
      label: 'GitHub',
      href: 'https://github.com/yourusername/omgbff',
      variant: 'outline',
      icon: 'Github'
    }
  ]
}

export { HERO, TECH, STEPS, DEMOS, CTA }
