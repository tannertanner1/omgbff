const THEMES = [
  {
    name: "Default",
    value: "default",
  },
  {
    name: "Neobrutal",
    value: "neobrutalism",
  },
  {
    name: "Clay",
    value: "claymorphism",
  },
]

type Theme = (typeof THEMES)[number]

const DEFAULT_THEME = "neobrutalism"

const META_THEME_COLORS = { light: "#fbfbfb", dark: "#1c1c1c" }

export { THEMES, type Theme, DEFAULT_THEME, META_THEME_COLORS }
