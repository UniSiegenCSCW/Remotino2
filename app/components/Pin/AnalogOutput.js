import React, { Component, PropTypes } from 'react';

export default class DigitalInput extends Component {
  static propTypes = {
    write: PropTypes.func.isRequired,
  };

  render() {
    const { write } = this.props;

    return (
      <input
        type="range"
        name="pwm"
        min="0" max="255"
        defaultValue="0"
        onChange={(e) => write(e.target.value)}
      />
    );
  }
}
