import React, { PropTypes } from 'react';

const Checkbox = ({ checked, onChange }) => (
  <input
    type="checkbox"
    onChange={e => onChange(e.target.checked)}
    checked={checked}
  />
);

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
