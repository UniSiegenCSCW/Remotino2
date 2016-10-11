import React, { PropTypes } from 'react';
import Checkbox from '../Checkbox';

const DigitalOutput = ({ write, value }) => (
  <label className="label-switch">
    <Checkbox checked={value === 1} onChange={v => write(v ? 1 : 0)} />
    <div className="checkbox" />
  </label>
);

DigitalOutput.propTypes = {
  write: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default DigitalOutput;
