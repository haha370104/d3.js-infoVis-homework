import * as d3 from 'd3'
import { Selection } from 'd3-selection'
import { Flower, fetchFlowers } from './fetcher'

let axisName = {
  x: 'sepalLength',
  y: 'sepalWidth',
}

type axisType = 'x' | 'y'

const categoryName = 'species'

const color = d3.scaleOrdinal(d3.schemeCategory10)

export default class ScatterPlotBuilder {
  private flowers: Flower[]

  private plotContainerId = 'plot-container'

  private width: number
  private height: number
  private margin: { left: number, right: number, top: number, bottom: number }

  private root: Selection<any, any, any, any>
  private toolTips: Selection<any, any, any, any>
  private dropList: Selection<any, any, any, any>

  private initRoot() {
    return d3.select('#root').append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
  }

  private initLegend() {
    const legend = this.root.selectAll('.legend')
      .data(color.domain())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        return `translate(0,${i * 20})`
      })

    legend.append('rect')
      .attr('x', this.width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color)

    legend.append('text')
      .attr('x', this.width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d) {
        return d
      })
    return legend
  }

  private initToolTip() {
    return d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
  }

// 我是终于明白为什么说d3.js是数据可视化框架版的jQuery了
  private initDropList(axisNames: string[]) {
    const dropList = d3.select('body').append('div').attr('class', 'drop-list-container')
    dropList.append('text').attr('class', 'label').text('dropList')
    const addSelections = (container: Selection<any, any, any, any>, dimension: axisType, axisNames: string[]) => {
      const singleContainer = container.append('div').attr('class', 'single-list-container')
      singleContainer.append('text').attr('class', 'label').text(`${dimension}：`)
      const selectContainer = singleContainer.append('select').attr('class', 'select')
      axisNames.forEach(value => {
        const option = selectContainer.append('option').attr('value', value)
          .text(value)
        if (value === axisName[dimension]) {
          option.attr('selected', '')
        }
      })
      selectContainer.on('change', (e) => {
        this.dropListChanged(axisNames[d3.event.currentTarget.selectedIndex], dimension)
      })
    }
    addSelections(dropList, 'x', axisNames)
    addSelections(dropList, 'y', axisNames)
    return dropList
  }

  private initPlot() {
    const xScale = d3.scaleLinear().range([0, this.width]).nice()
    const yScale = d3.scaleLinear().range([this.height, 0]).nice()

    const xAxis = d3.axisBottom(xScale).ticks(20, 's')
    const yAxis = d3.axisLeft(yScale).ticks(20, 's')

    const xValue = (datum) => datum[axisName.x]
    const yValue = (datum) => datum[axisName.y]
    const cValue = (datum) => datum[categoryName]

    xScale.domain([d3.min(this.flowers, xValue) - 1, d3.max(this.flowers, xValue) + 1])
    yScale.domain([d3.min(this.flowers, yValue) - 1, d3.max(this.flowers, yValue) + 1])

    const container = this.root.append('g').attr('id', this.plotContainerId)

    const zoomed = () => {
      const new_xScale = d3.event.transform.rescaleX(xScale)
      const new_yScale = d3.event.transform.rescaleY(yScale)
      gX.call(xAxis.scale(new_xScale))
      gY.call(yAxis.scale(new_yScale))
      points.data(this.flowers)
        .attr('cx', (d) => {
          return new_xScale(d[axisName.x])
        })
        .attr('cy', (d) => {
          return new_yScale(d[axisName.y])
        })
    }

    const zoomBehavior = d3.zoom()
      .scaleExtent([.5, 20])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', zoomed)

    container.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(zoomBehavior)

    const gX = container.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(xAxis)

    gX.append('text')
      .attr('class', 'label')
      .attr('x', this.width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text(axisName.x)

    const gY = container.append('g')
      .attr('id', 'y-axis')
      .call(yAxis)

    gY.append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(axisName.y)

    const dotContainer = container.append('g')

    const points = dotContainer.selectAll('.dot')
      .data(this.flowers)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 3.5)
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .style('fill', (d) => {
        return color(cValue(d))
      })

    points.on('mouseover', (d) => {
      this.toolTips.transition()
        .duration(200)
        .style('opacity', .9)
      this.toolTips.html(`${d[categoryName]}<br/>(${xValue(d)}, ${yValue(d)})`)
        .style('left', (d3.event.pageX + 5) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px')
    }).on('mouseout', (d) => {
      this.toolTips.transition()
        .duration(500)
        .style('opacity', 0)
    })
    this.initLegend()
  }

  private updatePlot() {
    // 我们老实说 这样做真的不好 但是其实这个框架本身就缺少数据双向绑定 即使是做好看点也就是扔掉的粒度小一点
    d3.select(`#${this.plotContainerId}`).remove()
    this.initPlot()
  }

  private dropListChanged(newValue: string, dimension: axisType) {
    axisName[dimension] = newValue
    this.updatePlot()
  }

  public constructor(flowers: Flower[], axisNames: string[], width, height, margin) {
    this.flowers = flowers
    this.width = width
    this.height = height
    this.margin = margin
    this.root = this.initRoot()
    this.toolTips = this.initToolTip()
    this.dropList = this.initDropList(axisNames)
    this.initPlot()
  }
}

