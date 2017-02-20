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
    changeVisibleInterval: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

//    const duration = 30 * 1000;
//    const endDate = timestamp();
//    const startDate = endDate - duration;
//    const startInterval = [startDate, endDate];

    this.state = {
      autoscroll: true,
//      interval: startInterval,
      replayPlaying: false,
      markerTime: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.replayPlaying !== nextProps.replay.playing) {
      if (nextProps.replay.playing) {
        const markerUpdate = () => {
          this.markerTimer = setInterval(() => {
            if (this.state.markerTime <= nextProps.ui.interval[1]) {
              this.setState({
                markerTime: this.state.markerTime + 200,
              });
//            } else if (this.state.replayPlaying) {
//              this.setState({
//                markerTime:
//                  nextProps.ui.interval[0]
//                    + (this.state.markerTime - nextProps.ui.interval[1])
//              });
            }
//            this.forceUpdate();
          }, 200);
        };
        const markerLoop = () => {
          clearInterval(this.markerTimer);
          this.setState({
            markerTime: nextProps.ui.interval[0]
          });
          markerUpdate();
          this.loop = setTimeout(markerLoop, nextProps.ui.interval[1] - nextProps.ui.interval[0]);
        };
        markerLoop();
        this.setState({
          replayPlaying: nextProps.replay.playing,
//          markerTime: nextProps.ui.interval[0]
        });
      } else {
        clearInterval(this.markerTimer);
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
    this.props.changeVisibleInterval(interval);
//    this.setState({
//      interval
//    });
//    this.forceUpdate();
  }

  handleAutoScrollUpdate(autoscroll) {
    this.setState({
      autoscroll
    });
    this.forceUpdate();
  }

  render() {
    const {
      pins,
      ui,
    } = this.props;

    let interval = ui.interval;
    if (this.state.autoscroll) {
      const duration = ui.interval[1] - ui.interval[0];
      const end = timestamp();
      interval = [end - duration, end];
    }

    return (
      <div className="pin-list" ref="pinlist">
        {pins.map((pin) =>
          <Pin
            key={pin.id}
            pin={pin}
            scrollIntoView={(child) => this.scrollElementIntoViewIfNeeded(this, child)}
            interval={interval}
            autoscroll={this.state.autoscroll}
            showMarker={this.state.replayPlaying}
            markerTime={this.state.markerTime}
            onIntervalUpdate={this.handleIntervalUpdate.bind(this)}
            onAutoScrollUpdate={this.handleAutoScrollUpdate.bind(this)}
          />)}
      </div>
    );
  }
}
