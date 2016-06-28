import React, { PropTypes } from 'react';

const Link = ({ children, onClick }) => (
  <a
    className="link"
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
};

export default Link;
