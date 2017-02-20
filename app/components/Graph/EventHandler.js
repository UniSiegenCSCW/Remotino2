import React from 'react';
// import ReactDOM from 'react-dom';
// import d3 from 'd3';
// import './LineChart.sass';

export default class EventHandler extends React.Component {

  static propTypes = {
    children:	React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node,
    ]),
    onZoom:	React.PropTypes.func.isRequired,
    xScale:	React.PropTypes.func.isRequired,
    width:	React.PropTypes.number.isRequired,
    height:	React.PropTypes.number.isRequired,
    startData:	React.PropTypes.number,
    endData:	React.PropTypes.number,
    onAutoScroll: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      // stores if the chart is currently panned
      isPanning: false,
      // the current view (timepointsin milliseconds) of the chart when panning action starts
      panStart: null,
      panEnd: null,
      // mouse position at the start of the panning action
      mousePosition: null,
    };

    // bind currenct context to the handlermethods for convenience
    this.handleWheel = this.handleWheel.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  // gets the current mouse position relative to the graph
  getMousePosition(event) {
    const doc = document.documentElement;
    const rect = this.eventRect.getBoundingClientRect();

    const left = (rect.left + window.pageXOffset) - doc.clientLeft;
    const top = (rect.top + window.pageYOffset) - doc.clientTop;

    return [
      event.pageX - left,
      event.pageY - top
    ];
  }

  // notifys the parent if it should autoscroll
  handleAutoScroll(autoscroll) {
    if (this.props.onAutoScroll) {
      this.props.onAutoScroll(autoscroll);
    }
  }

  // handle the mouse movement and report the new viewboundaries to the parent,
  // so it can redraw the new view
  handleMouseMove(e) {
    // tell the event, that we will handle it
    e.preventDefault();

    // make shure that we are in the panning state
    if (this.state.isPanning) {
      // get the x offset between current and last mouseposition
      const offset = this.props.xScale.invert(e.pageX).getTime() -
        this.props.xScale.invert(this.state.mousePosition[0]).getTime();

      // calculate the new viewboundaries
      const startPanned = parseInt(this.state.panStart - offset, 10);
      const endPanned = parseInt(this.state.panEnd - offset, 10);

      // check if the new view in the boundaries of props startData and endData.
      // if not correct the view. check also if it should autoscroll
      const result = this.isInRange(startPanned, endPanned);

      // inform chart of the new view
      if (this.props.onZoom) {
        this.props.onZoom([
          result[0],
          result[1]
        ]);
      }
    }
  }

  // handle the mouse up by removing listeners and set right state
  handleMouseUp(e) {
    // tell event, we taking care of action
    e.stopPropagation();

    // remove the onMouseDown registered listeners
    document.removeEventListener('mouseover', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);

    // switch back to default state
    this.setState({
      isPanning: false,
      panStart: null,
      panEnd: null,
      mousePosition: null,
    });
  }

  // register the neccessary listeners and switch to panning state
  handleMouseDown(e) {
    // and again tell event, we taking care of action
    e.preventDefault();

    // register to listeners
    document.addEventListener('mouseover', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);

    // switch into panning state and init the panning current view (panStart, panEnd)
    // and the initial mouseposition
    this.setState({
      isPanning: true,
      panStart: this.props.xScale.domain()[0].getTime(),
      panEnd: this.props.xScale.domain()[1].getTime(),
      mousePosition: [e.pageX, e.pageY],
    });
  }

  // this method will check if the current view is in the allowed boundaries
  // (props => startData, endData). also check if autoscroll is neccessary
  isInRange(start, end) {
    let resultStart;
    let resultEnd;
    resultStart = start;
    resultEnd = end;
    // if startData is set check if it is in the boundary
    if (this.props.startData && resultStart < this.props.startData) {
      // it is not, so store the range of the view
      const duration = resultEnd - resultStart;
      // set resultStart to the left limit
      resultStart = this.props.startData;
      // set resultEnd accordingly with the previous distance to resultStart
      resultEnd = resultStart + duration;
      // check if we overshot with the distance
      if (this.props.endData && resultEnd > this.props.endData) {
        // endData is set and we overshot it. so set the right limit
        resultEnd = this.props.endData;
      }
    }
    // this time check if endData is
    if (this.props.endData) {
      // endData is set, now check if it is in limit
      if (resultEnd >= this.props.endData) {
        // ok, here it is overshot or just exact the limit
        // so check if we really over
        if (resultEnd > this.props.endData) {
          // yes, we are over the limit. just correct it accordingly to the
          // limit. and also check if startData stil in range after.
          const duration = resultEnd - resultStart;
          resultEnd = this.props.endData;
          resultStart = resultEnd - duration;
          if (this.props.startData && resultStart < this.props.startData) {
            resultStart = this.props.startData;
          }
        }
        // we are now at the most right possible, so signal autoscroll
        this.handleAutoScroll(true);
      } else {
        // yes it is in limit, also autoscroll is not needed
        this.handleAutoScroll(false);
      }
    }
    return [resultStart, resultEnd];
  }

  // handle the wheel actions so we can zoom in and out
  handleWheel(e) {
    // again, we are taking control over the event
    e.preventDefault();

    const mousePosition = this.getMousePosition(e);

    // get the left side, where the mouse is scrolling
    // and the right side of view (all in milliseconds)
    const start = this.props.xScale.domain()[0].getTime();
    const middle = this.props.xScale.invert(mousePosition[0]).getTime();
    const end = this.props.xScale.domain()[1].getTime();

    // get the scaling factor for zooming from the mouse
    const ZOOM = 0.001;
    let scale = 1 + (e.deltaY * ZOOM);
    // don't let the mousewheel get to crazy
    if (scale > 3) {
      scale = 3;
    }
    if (scale < 0.1) {
      scale = 0.1;
    }

    // calculate the new view with the scale
    const startZoomed = middle - parseInt((middle - start) * scale, 10);
    const endZoomed = middle + parseInt((end - middle) * scale, 10);

    // check if it is the range
    const result = this.isInRange(startZoomed, endZoomed);

    // tell chart the new viewfield
    if (this.props.onZoom) {
      this.props.onZoom([
        result[0],
        result[1]
      ]);
    }
  }

  render() {
    // if we are panning change the mousecursor
    const cursor = this.state.isPanning ? '-webkit-grabbing' : 'auto';

    // all the listeners we need
    const handlers = {
      onWheel: this.handleWheel,
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      onMouseMove: this.handleMouseMove,
    };

    return (
      <g pointerEvents="all" {...handlers}>
        <rect
          key="event-rect"
          ref={(rect) => { this.eventRect = rect; }}
          style={{ opacity: 0.0, cursor }}
          x={0} y={0}
          width={this.props.width}
          height={this.props.height}
        />
        { this.props.children }
      </g>
    );
  }
}
