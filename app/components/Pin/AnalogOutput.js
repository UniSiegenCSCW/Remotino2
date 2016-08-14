import React, { Component, PropTypes } from 'react';

export default class DigitalInput extends Component {
  static propTypes = {
    write: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 0 /** Start value **/
    };
  }

  handleChange(value) {
    this.setState({
      value
    });
  }

  render() {
    const { write } = this.props;
    const { value } = this.state;

    return (
      <div>
        <p className="nomargin">Value: {value}% ({Math.round(value * 2.55)})</p>
        <input
          type="range"
          name="pwm"
          min="0" max="100"
          defaultValue="0"
          step="5"
          value={value}
          onChange={(e) => {
            this.handleChange(e.target.value);
            write(e.target.value * 2.55); // map from 0..100 to 0..255
          }}
        />
      </div>
    );
  }
}
