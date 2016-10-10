import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Pin from '../containers/Pin';
import './Microcontroller.sass';
// import FontAwesome from 'react-fontawesome';

export default class PinList extends Component {
  static propTypes = {
    pins: PropTypes.array.isRequired,
  };

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

  render() {
    const { pins } = this.props;

    return (
      <div className="pin-list" ref="pinlist">
        {pins.map((pin) =>
          <Pin
            key={pin.id}
            pin={pin}
            scrollIntoView={(child) => this.scrollElementIntoViewIfNeeded(this, child)}
          />
        )}
      </div>
    );
  }
}
