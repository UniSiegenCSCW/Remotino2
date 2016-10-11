import React, { PropTypes } from 'react';

const DigitalInput = ({ value, write }) => (
  <div>
    <p className="nomargin">
       Value:&nbsp;
      <input
        type="number"
        name="pwm2"
        min="0" max="100"
        value={Math.round(value / 2.55)}
        size="3"
        onChange={(e) => {
          write(e.target.value * 2.55); // map from 0..100 to 0..255
        }}
      />% (raw: {Math.round(value)})
    </p>
    <input
      type="range"
      name="pwm"
      min="0" max="100"
      step="5"
      value={value / 2.55}
      onChange={(e) => {
        write(e.target.value * 2.55); // map from 0..100 to 0..255
      }}
    />
  </div>
);

DigitalInput.propTypes = {
  write: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default DigitalInput;
