import { pgEnum } from 'drizzle-orm/pg-core'

const ADDRESS_LABELS = ['Mailing', 'Billing'] as const
type AddressLabel = (typeof ADDRESS_LABELS)[number]
const addressLabel = pgEnum('address_label', ADDRESS_LABELS)

const PHONE_LABELS = ['Primary', 'Secondary'] as const
type PhoneLabel = (typeof PHONE_LABELS)[number]
const phoneLabel = pgEnum('phone_label', PHONE_LABELS)

const COUNTRIES = ['Canada', 'United States'] as const
type Country = (typeof COUNTRIES)[number]
const country = pgEnum('country', COUNTRIES)

const US_STATES = [
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

const CANADIAN_PROVINCES = [
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

type Region = (typeof US_STATES)[number] | (typeof CANADIAN_PROVINCES)[number]
const region = pgEnum('region', [...US_STATES, ...CANADIAN_PROVINCES])

const getRegionsByCountry = (country: Country) => {
  return country === 'Canada' ? CANADIAN_PROVINCES : US_STATES
}

const getPostalCodeMask = (country: Country) => {
  return country === 'Canada' ? 'A9A 9A9' : '99999'
}

export {
  ADDRESS_LABELS,
  PHONE_LABELS,
  COUNTRIES,
  US_STATES,
  CANADIAN_PROVINCES,
  addressLabel,
  phoneLabel,
  country,
  region,
  getRegionsByCountry,
  getPostalCodeMask
}

export type { AddressLabel, PhoneLabel, Country, Region }
