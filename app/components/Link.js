import React, { PropTypes } from 'react';

const Link = ({ children, onClick, className }) => (
  <a
    className={`link ${className}`}
    href="#"
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
  >
    {children}
  </a>
);

Link.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Link;
