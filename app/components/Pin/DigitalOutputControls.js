import React, { Component, PropTypes } from 'react';

export default class DigitalOutputControls extends Component {
  static propTypes = {
    write: PropTypes.func.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    disabled: React.PropTypes.bool,
  };

  render() {
    const { write, value, disabled } = this.props;

    return (
      <label className="label-switch">
        <input
          type="checkbox"
          onChange={e => write(e.target.checked ? 1 : 0)}
          checked={value}
          disabled={disabled}
        />
        <div className="checkbox" />
      </label>
    );
  }
}
