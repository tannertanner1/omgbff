export const hero = {
  title: 'Lorem ipsum dolor sit amet',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}

export const steps = [
  {
    step: 1,
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'Lorem ipsum dolor sit amet'
  },
  {
    step: 2,
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'Lorem ipsum dolor sit amet'
  },
  {
    step: 3,
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'Lorem ipsum dolor sit amet'
  }
]

export const features = {
  title: 'Lorem ipsum dolor sit amet',
  subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  features: [
    {
      icon: 'Lorem ipsum',
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      icon: 'Lorem ipsum',
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      icon: 'Lorem ipsum',
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      icon: 'Lorem ipsum',
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      icon: 'Lorem ipsum',
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      icon: 'Lorem ipsum',
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
  ]
}

export const walkthrough = {
  title: 'Lorem ipsum dolor sit amet',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
}

export const cta = {
  title: 'Lorem ipsum dolor sit amet',
  buttons: [
    {
      label: 'Lorem ipsum',
      href: 'https://loremipsum.com',
      variant: 'Lorem ipsum',
      icon: 'Lorem ipsum'
    }
  ]
}

type Section = {
  title: string
  description: string
  items: Video[]
}

export const sections: Section[] = [
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
