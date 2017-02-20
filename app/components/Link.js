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
        {icon ? <FontAwesome name={icon || 'none'} /> : null}
        {content ? <Translate content={content} /> : null}
        {children}
      </a>
    );
  }
  return (
    <span className={`link ${className} link--disabled`}>
      {icon ? <FontAwesome name={icon || 'none'} /> : null}
      {content ? <Translate content={content} /> : null}
      {children}
    </span>
  );
};

Link.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  enabled: PropTypes.bool,
  icon: PropTypes.string,
  content: PropTypes.string,
};

export default Link;
