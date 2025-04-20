const THEMES = [
  {
    name: "Default",
    value: "default",
  },
  // {
  //   name: "Neutral",
  //   value: "neutral",
  // },
  // {
  //   name: "Scaled",
  //   value: "scaled",
  // },
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

export { THEMES, type Theme }
