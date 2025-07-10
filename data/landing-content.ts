import {
  IconBrandGithub,
  IconClockFilled,
  IconCoinFilled,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react"
import {
  AuthjsIcon,
  DrizzleIcon,
  MotionIcon,
  NeonIcon,
  NextjsIcon,
  ReactIcon,
  ResendIcon,
  ShadcnIcon,
  StripeIcon,
  TailwindcssIcon,
  TypescriptIcon,
  VercelIcon,
} from "@/components/icons"

const HERO = {
  changelog: "/changelog",
  section: "Announcing public beta",
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
        "Scheduled invoices, real-time payments, and clean reporting, automatically.",
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
          title: "Create and access your account",
          description:
            "Set up a new account in seconds or log in to your secure portal",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "live" satisfies Status,
          title: "Manage clients and services",
          description:
            "Add people or businesses, organize by service type, and update info anytime",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "live" satisfies Status,
          title: "Invite collaborators",
          description:
            "Share access with clients, teammates, or external partners",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "soon" satisfies Status,
          title: "Submit forms and pay invoices",
          description:
            "Request services, upload documents, and make secure payments",
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
          title: "Set up your team and workspace",
          description:
            "Invite admins, define access, and configure your environment in minutes",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "soon" satisfies Status,
          title: "Get visibility into usage and activity",
          description:
            "Track logins, user sessions, and client interactions in real time",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "planned" satisfies Status,
          title: "Send updates and assign work",
          description:
            "Send prebuilt templates, trigger tasks, and monitor internal progress",
          video: "#",
          thumbnail: "https://placehold.co/180x320/transparent/transparent",
        },
        {
          status: "planned" satisfies Status,
          title: "Handle billing and operations",
          description:
            "Create invoices, track payments, and keep your records clean",
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
    href: "https://github.com/tannertanner1/omgbff",
  },
}

export { HERO, TECH, STEPS, DEMOS, CTA }
