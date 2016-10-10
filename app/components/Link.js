import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import Translate from 'react-translate-component';

const Link = ({ children, onClick, className, enabled, icon, content }) => {
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
        {icon !== '' ? <FontAwesome name={icon} /> : null}
        {content !== '' ? <Translate content={content} /> : null}
        {children}
      </a>
    );
  } else {
    return (
      <span className={`link ${className} link--disabled`}>
        { content !== '' ? <Translate content={content} /> : null } {children}
      </span>
    );
  }
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  enabled: PropTypes.bool,
  icon: PropTypes.string,
  content: PropTypes.string,
};

export default Link;
