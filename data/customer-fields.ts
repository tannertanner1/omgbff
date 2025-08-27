import { pgEnum } from "drizzle-orm/pg-core"

const ADDRESS = ["Mailing", "Billing"] as const
type Address = (typeof ADDRESS)[number]
const address = pgEnum("address", ADDRESS)

const PHONE = ["Primary", "Secondary"] as const
type Phone = (typeof PHONE)[number]
const phone = pgEnum("phone", PHONE)

const COUNTRY = ["Canada", "United States", "Japan"] as const
type Country = (typeof COUNTRY)[number]
const country = pgEnum("country", COUNTRY)

const STATE = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const

const PROVINCE = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
] as const

const PREFECTURE = [
  "Aichi",
  "Akita",
  "Aomori",
  "Chiba",
  "Ehime",
  "Fukui",
  "Fukuoka",
  "Fukushima",
  "Gifu",
  "Gunma",
  "Hiroshima",
  "Hokkaido",
  "Hyogo",
  "Ibaraki",
  "Ishikawa",
  "Iwate",
  "Kagawa",
  "Kagoshima",
  "Kanagawa",
  "Kochi",
  "Kumamoto",
  "Kyoto",
  "Mie",
  "Miyagi",
  "Miyazaki",
  "Nagano",
  "Nagasaki",
  "Nara",
  "Niigata",
  "Oita",
  "Okayama",
  "Okinawa",
  "Osaka",
  "Saga",
  "Saitama",
  "Shiga",
  "Shimane",
  "Shizuoka",
  "Tochigi",
  "Tokushima",
  "Tokyo",
  "Tottori",
  "Toyama",
  "Wakayama",
  "Yamagata",
  "Yamaguchi",
  "Yamanashi",
] as const

type Region =
  | (typeof STATE)[number]
  | (typeof PROVINCE)[number]
  | (typeof PREFECTURE)[number]
const region = pgEnum("region", [...STATE, ...PROVINCE, ...PREFECTURE])

const CONFIG = {
  Canada: {
    regions: PROVINCE,
    defaultRegion: "British Columbia",
    regionLabel: "Province",
    postalLabel: "Postal code",
    postalMask: "a9a 9a9",
    postalRegex: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
  },
  "United States": {
    regions: STATE,
    defaultRegion: "California",
    regionLabel: "State",
    postalLabel: "ZIP code",
    postalMask: "99999-9999",
    postalRegex: /^\d{5}(-\d{4})?$/,
  },
  Japan: {
    regions: PREFECTURE,
    defaultRegion: "Tokyo",
    regionLabel: "Prefecture",
    postalLabel: "Postal code",
    postalMask: "999-9999",
    postalRegex: /^\d{3}-\d{4}$/,
  },
} as const

export {
  ADDRESS,
  PHONE,
  COUNTRY,
  STATE,
  PROVINCE,
  PREFECTURE,
  CONFIG,
  address,
  phone,
  country,
  region,
}

export type { Address, Phone, Country, Region }
