import { Hero } from "./hero"
import { Tech } from "./tech"
import { Steps } from "./steps"
import { Demos } from "./demos"
import { Cta } from "./cta"

import { IconTerminal } from "@tabler/icons-react"
import { Banner } from "@/components/banner"

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
