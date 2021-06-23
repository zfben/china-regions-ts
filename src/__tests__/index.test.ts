import { Version } from '..'
import { Regions } from '..'
import { Provinces } from '..'

it('version', function () {
  expect(Version).toEqual('20210329')
})

it('regions', function () {
  expect(Regions[0].name).toEqual('北京')
  expect(Regions[0].cities[0].name).toEqual('北京')
  expect(Regions[0].cities[0].areas[0].name).toEqual('东城')
})

it('provinces', function () {
  expect(Provinces[0].name).toEqual('北京')
})
