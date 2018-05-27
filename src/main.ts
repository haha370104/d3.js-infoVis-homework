import ScatterPlotBuilder from './util'
import { fetchFlowers } from './fetcher'

const margin = { top: 20, right: 20, bottom: 30, left: 40 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const main = async () => {
  const flowers = await fetchFlowers('../assets/flowers.csv')
  const plot = new ScatterPlotBuilder(flowers,
    ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth'],
    width,
    height,
    margin)
}

main().then(() => {
  console.log('finished')
})
