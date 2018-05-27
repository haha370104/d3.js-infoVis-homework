import * as d3 from 'd3'

const margin = { top: 20, right: 20, bottom: 30, left: 40 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const xScale = d3.scaleLinear().range([0, width])
const yScale = d3.scaleLinear().range([height, 0])

let xAxisName = 'sepal length'
let yAxisName = 'sepal width'
let categoryName = 'species'

const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale)

const xValue = (datum) => datum[xAxisName]
const yValue = (datum) => datum[yAxisName]
const cValue = (datum) => datum[categoryName]
const color = d3.scaleOrdinal(d3.schemeCategory10)

const numberColumns = ['sepal length', 'sepal width', 'petal length', 'petal width']

const svg = d3.select('#root').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv('../assets/flowers.csv', null).then((value => {
  const formatValue = []

  value.forEach(function (d) {
    let newValue: { [key: string]: any } = d
    numberColumns.forEach(column => {
      newValue[column] = parseFloat(newValue[column])
    })
    formatValue.push(newValue)
  })

  xScale.domain([d3.min(formatValue, xValue) - 1, d3.max(formatValue, xValue) + 1])
  yScale.domain([d3.min(formatValue, yValue) - 1, d3.max(formatValue, yValue) + 1])

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .append('text')
    .attr('class', 'label')
    .attr('x', width)
    .attr('y', -6)
    .style('text-anchor', 'end')
    .text(xAxisName)

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text(yAxisName)

  svg.selectAll('.dot')
    .data(formatValue)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('r', 3.5)
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)))
    .style('fill', function (d) {
      return color(cValue(d))
    })
    .on('mouseover', function (d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9)
      tooltip.html(d[categoryName] + '<br/> (' + xValue(d)
        + ', ' + yValue(d) + ')')
        .style('left', (d3.event.pageX + 5) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px')
    })
    .on('mouseout', function (d) {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })


  const legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
      return d;
    })
})).catch(error => {
  alert('哇 你的数据错了啊兄弟')
})
