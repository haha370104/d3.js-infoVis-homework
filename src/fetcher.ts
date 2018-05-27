import {csv} from 'd3-fetch'

export interface Flower {
  sepalLength: number
  sepalWidth: number
  petalLength: number
  petalWidth: number
  species: string
}

export const fetchFlowers = async (path): Promise<Flower[]> => {
  try {
    const rawData = await csv(path)
    const flowers: Flower[] = []
    rawData.forEach(value => {
      flowers.push({
        sepalWidth: parseFloat(value['sepal width']),
        sepalLength: parseFloat(value['sepal length']),
        petalWidth: parseFloat(value['petal width']),
        petalLength: parseFloat(value['petal length']),
        species: value['species'],
      })
    })
    return flowers
  } catch {
    alert('兄弟啊 检查你的数据去吧')
    return []
  }
}
