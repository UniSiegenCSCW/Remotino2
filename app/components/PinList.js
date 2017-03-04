import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Pin from '../containers/Pin';
import './Microcontroller.sass';
import { timestamp } from '../utils/utils';
// import FontAwesome from 'react-fontawesome';

export default class PinList extends Component {
  static propTypes = {
    pins: PropTypes.array.isRequired,
    ui: PropTypes.object.isRequired,
    replay: PropTypes.object.isRequired,
    changeVisibleInterval: PropTypes.func.isRequired,
    changeAutoscroll: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
//    const duration = 30 * 1000;
//    const endDate = timestamp();
//    const startDate = endDate - duration;
//    const startInterval = [startDate, endDate];

    this.state = {
//      autoscroll: true,
//      interval: startInterval,
      replayPlaying: false,
      markerTime: null,
    };

    this.handleIntervalUpdate = this.handleIntervalUpdate.bind(this);
    this.handleAutoScrollUpdate = this.handleAutoScrollUpdate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let foundValues = false;
    for (let i = 0; i < nextProps.pins.length; i += 1) {
      if (nextProps.pins[i].values.length !== 0) {
        foundValues = true;
        break;
      }
    }
    if (!foundValues) {
      // we have found values so set autoscroll true
      if (nextProps.ui.autoscroll !== true) {
        this.props.changeAutoscroll(true);
      }
//      this.setState({
//        autoscroll: true,
//      });
    }
    if (this.state.replayPlaying !== nextProps.replay.playing) {
      if (nextProps.replay.playing) {
        const start = nextProps.replay.replayStart;
        const end = nextProps.replay.replayEnd;
        const time = end - start;
        this.props.changeVisibleInterval([start, end]);

        const markerUpdate = (markerTime) => {
          const progressed = Date.now() - this.startTime;
          this.startTime = Date.now();
          const nextMarkerTime = markerTime + progressed;
          this.setState({
            markerTime: nextMarkerTime,
          });
          this.markerTimer = setTimeout(() => {
            if (markerTime <= end) {
              markerUpdate(nextMarkerTime);
            }
          }, 200);
        };
        const markerLoop = () => {
          clearTimeout(this.markerTimer);
          this.setState({
            markerTime: start
          });
          this.startTime = Date.now();
          markerUpdate(start);
          this.loop = setTimeout(markerLoop, time);
        };
        markerLoop();
        if (nextProps.ui.autoscroll) {
          this.props.changeAutoscroll(false);
        }
        this.setState({
          replayPlaying: nextProps.replay.playing,
          //autoscroll: false,
//          markerTime: nextProps.ui.interval[0]
        });
      } else {
        clearTimeout(this.markerTimer);
        clearTimeout(this.loop);
        this.setState({
          replayPlaying: nextProps.replay.playing,
          markerTime: null
        });
      }
    }
  }

  scrollElementIntoViewIfNeeded(container, childNode) {
    const containerNode = ReactDOM.findDOMNode(container);

    const containerRect = containerNode.getBoundingClientRect();
    const childRect = childNode.getBoundingClientRect();
    const delta = containerRect.bottom - childRect.bottom;

    // if the bottom part of the child element is hidden
    if (delta < 0) {
      const from = containerNode.scrollTop;
      const to = from - (delta - 10);

      const position = (start, end, elapsed, duration) => {
        if (elapsed > duration) return end;
        return start + ((end - start) * (elapsed / duration));
      };

      const clock = Date.now();
      const duration = 500;

      const scroll = () => {
        const elapsed = Date.now() - clock;
        if (elapsed < duration) {
          containerNode.scrollTop = position(from, to, elapsed, duration);
          window.requestAnimationFrame(scroll);
        }
      };
      scroll();
    }
  }

  handleIntervalUpdate(interval) {
    if (!this.state.replayPlaying) {
      this.props.changeVisibleInterval(interval);
    }
//    this.setState({
//      interval
//    });
//    this.forceUpdate();
  }

  handleAutoScrollUpdate(autoscroll) {
    if (!this.state.replayPlaying) {
      this.props.changeAutoscroll(autoscroll);
    }
//      this.setState({
//        autoscroll
//      });
//      this.forceUpdate();
//    }
  }

  render() {
    const {
      pins,
      ui,
    } = this.props;

    let interval = ui.interval;
    if (ui.autoscroll) {
      const duration = ui.interval[1] - ui.interval[0];
      const end = timestamp();
      interval = [end - duration, end];
    }

    return (
      <div className="pin-list">
        {pins.map(pin =>
          <Pin
            key={pin.id}
            pin={pin}
            scrollIntoView={child => this.scrollElementIntoViewIfNeeded(this, child)}
            interval={interval}
            autoscroll={ui.autoscroll}
            replayPlaying={this.state.replayPlaying}
            markerTime={this.state.markerTime}
            onIntervalUpdate={this.handleIntervalUpdate}
            onAutoScrollUpdate={this.handleAutoScrollUpdate}
          />)}
      </div>
    );
  }
}
