import {
  IconRosetteDiscountCheckFilled,
  IconClockFilled,
  IconCoinFilled,
  IconBrandGithub,
} from "@tabler/icons-react"
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
  VercelIcon,
} from "@/components/icons"

const HERO = {
  section: "🚀 Announcing public beta",
  title: "One app. Two dashboards.",
  description:
    "A client portal your customers actually want. An admin dashboard your team will use. From seamless onboarding to effortless invoicing.",
  link: "/login",
  button: "Get started",
  image: "https://placehold.co/1920x1200/transparent/transparent",
}

const TECH = {
  section: "Everything you need",
  title: "Built with industry standard tools",
  description: "Modern tech. Preconfigured and production-ready.",
  items: [
    {
      name: "React",
      icon: ReactIcon,
      url: "https://react.dev/",
    },
    {
      name: "Next.js",
      icon: NextjsIcon,
      url: "https://nextjs.org/",
    },
    {
      name: "TypeScript",
      icon: TypescriptIcon,
      url: "https://www.typescriptlang.org/",
    },
    {
      name: "Tailwind CSS",
      icon: TailwindcssIcon,
      url: "https://tailwindcss.com/",
    },
    {
      name: "Shadcn UI",
      icon: ShadcnIcon,
      url: "https://ui.shadcn.com/",
    },
    {
      name: "Motion",
      icon: MotionIcon,
      url: "https://motion.dev/",
    },
    {
      name: "Auth.js",
      icon: AuthjsIcon,
      url: "https://authjs.dev/",
    },
    {
      name: "Neon",
      icon: NeonIcon,
      url: "https://neon.tech/",
    },
    {
      name: "Drizzle",
      icon: DrizzleIcon,
      url: "https://orm.drizzle.team/",
    },
    {
      name: "Resend",
      icon: ResendIcon,
      url: "https://resend.com/",
    },
    {
      name: "Stripe",
      icon: StripeIcon,
      url: "https://stripe.com/",
    },
    {
      name: "Vercel",
      icon: VercelIcon,
      url: "https://vercel.com/",
    },
  ],
}

const STEPS = {
  section: "How it works",
  title: "Modern solutions, less overhead.",
  description: "Faster workflows. Less admin. More control.",
  items: [
    {
      icon: IconRosetteDiscountCheckFilled,
      title: "Simplify Onboarding",
      description:
        "Quick email signup, self-serve setup, and effortless account handoff.",
      image: "https://placehold.co/1920x1200/transparent/transparent",
    },
    {
      icon: IconClockFilled,
      title: "Streamline Management",
      description:
        "Centralized info, real-time activity, and no manual check-ins.",
      image: "https://placehold.co/1920x1200/transparent/transparent",
    },
    {
      icon: IconCoinFilled,
      title: "Automate Billing",
      description:
        "Scheduled invoices, real-time payments, and clean reporting—automatically.",
      image: "https://placehold.co/1920x1200/transparent/transparent",
    },
  ],
}

const STATUSES = ["live", "soon", "planned"] as const
type Status = (typeof STATUSES)[number]
const DEMOS = {
  section: "Feature walkthrough roadmap",
  title: "Shipped and shipping",
  description:
    "Discover the tools and workflows that make managing your accounts and operations simple and efficient.",
  items: [
    {
      title: "Client Portal",
      description:
        "Manage individual and business accounts, oversee services, and handle invoices through a secure, centralized portal.",
      items: [
        {
          status: "live" satisfies Status,
          title: "Creating an account",
          description: "Quick setup for new users",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "live" satisfies Status,
          title: "Logging in",
          description: "Access your client portal",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "live" satisfies Status,
          title: "Adding entities",
          description: "Manage individuals and businesses",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "live" satisfies Status,
          title: "Setting up accounts",
          description: "Organize by client or service type",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "live" satisfies Status,
          title: "Sending invites",
          description: "Share access with collaborators",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "live" satisfies Status,
          title: "Updating account info",
          description: "Keep details accurate and up to date",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "soon" satisfies Status,
          title: "Submitting forms",
          description: "Request a service or upload info",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "planned" satisfies Status,
          title: "Making payments",
          description: "Review and pay invoices securely",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
      ],
    },
    {
      title: "Admin Dashboard",
      description:
        "Manage users, track work, and send invoices with full visibility across your operations.",
      items: [
        {
          status: "live" satisfies Status,
          title: "Getting started",
          description: "Set up your team and workspace",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "soon" satisfies Status,
          title: "Dashboard overview",
          description: "Navigate and access tools fast",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "soon" satisfies Status,
          title: "Monitoring user activity",
          description: "Track accounts and service usage",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "planned" satisfies Status,
          title: "Sending templates",
          description: "Send forms, messages, and updates",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "planned" satisfies Status,
          title: "Managing tasks",
          description: "Trigger and track internal work",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "planned" satisfies Status,
          title: "Organizing worklogs",
          description: "Keep notes and log activity",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "soon" satisfies Status,
          title: "Publishing invoices",
          description: "Create and send client invoices",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "soon" satisfies Status,
          title: "Managing payments",
          description: "Track payment status and history",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
      ],
    },
  ],
}

const CTA = {
  section: "Get started faster",
  title: "100% open-source & free",
  description: "",
  button: {
    icon: IconBrandGithub,
    text: "GitHub",
    href: "https://github.com/yourusername/omgbff",
  },
}

export { HERO, TECH, STEPS, DEMOS, CTA }
