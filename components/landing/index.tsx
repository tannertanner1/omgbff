import { IconTerminal } from "@tabler/icons-react"
import { Banner } from "@/components/banner"
import { Cta } from "./cta"
import { Demos } from "./demos"
import { Hero } from "./hero"
import { Steps } from "./steps"
import { Tech } from "./tech"

function Landing() {
  return (
    <>
      <Banner icon={<IconTerminal size={16} />}>
        Media and changelog on the way
      </Banner>

      <Hero />
      <Tech />
      <Steps />
      <Demos />
      <Cta />
    </>
  )
}

export { Landing }
