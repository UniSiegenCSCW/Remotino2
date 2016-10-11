import React, { PropTypes } from 'react';

const DigitalOutput = props => (
  <label className="label-switch">
    <input
      type="checkbox"
      onChange={(e) => props.write(e.target.checked ? 1 : 0)}
      checked={props.value}
    />
    <div className="checkbox" />
  </label>
);

DigitalOutput.propTypes = {
  write: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default DigitalOutput;
