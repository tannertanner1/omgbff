import { pgEnum } from 'drizzle-orm/pg-core'

const ADDRESS = ['Mailing', 'Billing'] as const
type Address = (typeof ADDRESS)[number]
const address = pgEnum('address', ADDRESS)

const PHONE = ['Primary', 'Secondary'] as const
type Phone = (typeof PHONE)[number]
const phone = pgEnum('phone', PHONE)

const COUNTRY = ['Canada', 'United States'] as const
type Country = (typeof COUNTRY)[number]
const country = pgEnum('country', COUNTRY)

const STATE = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
] as const

const PROVINCE = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon'
] as const

type Region = (typeof STATE)[number] | (typeof PROVINCE)[number]
const region = pgEnum('region', [...STATE, ...PROVINCE])

const getRegionsByCountry = (country: Country) => {
  return country === 'Canada' ? PROVINCE : STATE
}

const getPostalCodeMask = (country: Country) => {
  return country === 'Canada' ? 'A9A 9A9' : '99999'
}

export {
  ADDRESS,
  PHONE,
  COUNTRY,
  STATE,
  PROVINCE,
  address,
  phone,
  country,
  region,
  getRegionsByCountry,
  getPostalCodeMask
}

export type { Address, Phone, Country, Region }
