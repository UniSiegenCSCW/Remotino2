import React, { Component, PropTypes } from 'react';

export default class DigitalInput extends Component {
  static propTypes = {
    write: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
  };

  render() {
    const { write, value } = this.props;

    return (
      <label className="label-switch">
        <input
          type="checkbox"
          onChange={(e) => write(e.target.checked ? 1 : 0)}
          checked={value}
        />
        <div className="checkbox"></div>
      </label>
    );
  }
}
