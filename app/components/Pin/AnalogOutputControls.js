import React, { Component, PropTypes } from 'react';

export default class AnalogOutputControls extends Component {
  static propTypes = {
    write: PropTypes.func.isRequired,
    value:	React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
  };

  render() {
    const { write, value } = this.props;

    return (
      <input
        type="range"
        name="pwm"
        min="0" max="255"
        step="5"
        value={value} // / 2.55
        onChange={(e) => {
          write(e.target.value); // * 2.55 map from 0..100 to 0..255
        }}
      />
    );
  }
}
