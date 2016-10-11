import React, { PropTypes } from 'react';

const DigitalInput = props => (
  <div>
    <p className="nomargin">
       Value:&nbsp;
      <input
        type="number"
        name="pwm2"
        min="0" max="100"
        value={Math.round(props.value / 2.55)}
        size="3"
        onChange={(e) => {
          props.write(e.target.value * 2.55); // map from 0..100 to 0..255
        }}
      />% (raw: {Math.round(props.value)})
    </p>
    <input
      type="range"
      name="pwm"
      min="0" max="100"
      step="5"
      value={props.value / 2.55}
      onChange={(e) => {
        props.write(e.target.value * 2.55); // map from 0..100 to 0..255
      }}
    />
  </div>
);

DigitalInput.propTypes = {
  write: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default DigitalInput;
