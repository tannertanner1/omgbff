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

const THEME = "neobrutalism"

type Theme = (typeof THEMES)[number]

export { THEMES, THEME, type Theme }
