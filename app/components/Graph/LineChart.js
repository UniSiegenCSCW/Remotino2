import React from 'react';
import d3 from 'd3';
import Axis from './Axis.js';
import Grid from './Grid.js';
import EventHandler from './EventHandler.js';
import './LineChart.sass';
// import { timestamp } from '../../utils/utils';

// let autoscroll = true;
let clipIdCounter = 0;
// let globalInterval = null;

export default class LineChart extends React.Component {

  static propTypes = {
    width:	React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    height:	React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    data:	React.PropTypes.array.isRequired,
    yMin:	React.PropTypes.number.isRequired,
    yMax:	React.PropTypes.number.isRequired,
    autoscroll:	React.PropTypes.bool,
    interval:	React.PropTypes.array,
    onIntervalUpdate:	React.PropTypes.func,
    onAutoScrollUpdate:	React.PropTypes.func,
    markerTime:	React.PropTypes.number,
    showMarker:	React.PropTypes.bool,
  };

  constructor(props) {
    super(props);

//    autoscroll = autoscroll === null ? true : autoscroll;

    const clipId = `clipPath_${clipIdCounter++}`;

//    const duration = 30 * 1000;

//    const endDate = timestamp();
//    const startDate = endDate - duration;

//    const startInterval = globalInterval !== null ? globalInterval : [startDate, endDate];

    this.state = {
//      showingInterval: null, // startInterval,
//      duration,
      clipId,
      margin: { top: 10, right: 10, bottom: 20, left: 30 },
    };
  }

  componentDidMount() {
    this.forceUpdate();
  }

//  shouldComponentUpdate(nextProps) {
//    if (this.props.data === nextProps.data
//      || this.props.interval === nextProps.interval) {
//      return false;
//    }
//    return true;
//  }

  handleZoom(interval) {
    if (this.props.onIntervalUpdate) {
      this.props.onIntervalUpdate(interval);
    }
//    globalInterval = interval;
//    this.forceUpdate();
  }

  handleAutoScroll(scroll) {
    if (this.props.onAutoScrollUpdate) {
      this.props.onAutoScrollUpdate(scroll);
    }
//    autoscroll = scroll;
  }

  render() {
    // prevent red screen during hot-swap in debugmode
//    if (this.state.showingInterval === null || this.state.showingInterval === undefined) {
//      return null;
//    }

    const { yMin, yMax, width, height, data, interval } = this.props;

    const svgWidth = this.svg != null
      ? this.svg.clientWidth
      : 200;
    const svgHeight = this.svg != null
      ? this.svg.clientHeight
      : 168;

    // just find the relevant data and copy it to new array.
    // this will only render the relevant data and hopefully increases performance.
    let firstX = data.length - 1;
    for (let i = firstX - 1; i >= 0; i--) {
      if (data[i].x >= interval[0]) {
        firstX = i;
        break;
      }
    }
    const lastX = data.findIndex((d) => d.x <= interval[1]);
    const relevantData = data.slice(lastX !== 0 ? lastX - 1 : lastX, firstX + 2);

    const lineAreaWidth = svgWidth - (this.state.margin.left + this.state.margin.right);
    const lineAreaHeight = svgHeight - (this.state.margin.top + this.state.margin.bottom);

    const xScale = d3.time.scale()
      .domain(interval)
      .rangeRound([0, lineAreaWidth]);

    const yScale = d3.scale.linear()
      .domain([yMin, yMax])
      .range([lineAreaHeight, 0]);

    const yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(5);

    const xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(10);

    const yGrid = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(5)
      .tickSize(-lineAreaWidth, 0, 0)
      .tickFormat('');

    const line = d3.svg.line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .interpolate('step-after');

    const endData = data.length !== 0 ? data[0].x : interval[1];
//    const endData = data[0].x;

    let marker = null;
    if (this.props.showMarker) {
      const markerPos = xScale(this.props.markerTime);
      if (markerPos) {
        marker = (
          <line
            className="marker"
            x1={markerPos}
            y1={0}
            x2={markerPos}
            y2={lineAreaHeight}
          />
        );
      }
    }

    return (
      <svg
        ref={(svg) => { this.svg = svg; }}
        width={width}
        height={height}
        onWheel={this.handleMouseWheel}
      >
        <g transform={`translate(${this.state.margin.left}, ${this.state.margin.top})`}>
          <Grid
            height={lineAreaHeight}
            grid={yGrid}
            gridType="y"
          />
          <Axis
            height={lineAreaHeight}
            axis={yAxis}
            axisType="y"
          />
          <Axis
            height={lineAreaHeight}
            axis={xAxis}
            axisType="x"
          />
          <EventHandler
            width={lineAreaWidth}
            height={lineAreaHeight}
            endData={endData}
            onZoom={this.handleZoom.bind(this)}
            xScale={xScale}
            onAutoScroll={this.handleAutoScroll.bind(this)}
          >
            <g>
              <clipPath id={this.state.clipId}>
                <rect
                  x={0}
                  y={-1}
                  width={lineAreaWidth}
                  height={lineAreaHeight + 2}
                />
              </clipPath>
              <path
                clipPath={`url(#${this.state.clipId})`}
                className="line"
                d={line(relevantData)}
                strokeLinecap="round"
              />
              { marker }
            </g>
          </EventHandler>
        </g>
      </svg>
    );
  }
}
