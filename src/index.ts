export { Version } from './version'
export { Regions } from './regions'
export { Provinces } from './provinces'

export type Area = {
  id: string
  name: string
  fullname: string
  location: {
    lat: number
    lng: number
  }
}

export type City = Area & {
  areas: Area[]
}

export type Province = Area & {
  cities: City[]
}
