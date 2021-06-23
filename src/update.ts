import request from '@faasjs/request'
import { writeFileSync } from 'fs'

(async function () {
  if (!process.env.KEY) throw Error('请在环境变量中设置 KEY')

  const data = await request<{
    status: number;
    message: string;
    data_version: string;
    result: any[];
  }>('https://apis.map.qq.com/ws/district/v1/list?key=' + process.env.KEY)

  if (data.body.status) throw Error(data.body.message)

  writeFileSync('./src/version.ts', `export const Version = '${data.body.data_version}'`)

  const regions = []
  const provinces = []
  for (const region of data.body.result[0]) {
    const province = {
      id: region.id,
      name: region.name,
      fullname: region.fullname,
      location: region.location
    }
    provinces.push(province)

    const cities = []

    // 非直辖市
    if (data.body.result[1][region.cidx[0]].cidx)
      for (let i = region.cidx[0]; i <= region.cidx[1]; i++) {
        const city = data.body.result[1][i]
        const areas = []

        if (city.cidx) {
          for (let ii = city.cidx[0]; ii <= city.cidx[1]; ii++) {
            const area = data.body.result[2][ii]
            areas.push({
              id: area.id,
              name: area.name || area.fullname,
              fullname: area.fullname,
              location: area.location
            })
          }

          cities.push({
            id: city.id,
            name: city.name,
            fullname: city.fullname,
            location: city.location,
            areas
          })
        } else 
          cities.push({
            id: city.id,
            name: city.name,
            fullname: city.fullname,
            location: city.location,
            areas: [
              {
                id: city.id,
                name: city.name,
                fullname: city.fullname,
                location: city.location
              }
            ]
          })
      }
    else {
      // 直辖市
      const areas = []
      for (let i = region.cidx[0]; i <= region.cidx[1]; i++) {
        const area = data.body.result[1][i]
        areas.push({
          id: area.id,
          name: area.name,
          fullname: area.fullname,
          location: area.location
        })
      }

      cities.push({
        id: region.id,
        name: region.name,
        fullname: region.fullname,
        location: region.location,
        areas
      })
    }
    regions.push({
      ...province,
      cities
    })
  }

  writeFileSync('./src/provinces.ts', `import { Area } from '.'

export const Provinces: Area[] = ${JSON.stringify(provinces, null, 2)}
`)

  writeFileSync('./src/regions.ts', `import { Province } from '.'

export const Regions: Province[] = ${JSON.stringify(regions, null, 2)}
`)
})()
