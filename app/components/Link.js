import React, { PropTypes } from 'react';

const Link = ({ children, onClick, className, enabled }) => {
  if (enabled || enabled === undefined) {
    return (
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
  } else {
    return (
      <span className={`link ${className} link--disabled`}>
        {children}
      </span>
    );
  }
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  enabled: PropTypes.boolean,
};

export default Link;
