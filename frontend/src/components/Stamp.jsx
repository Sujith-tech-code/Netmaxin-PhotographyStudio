import React from 'react';

const Stamp = ({ children, variant = 'default', className = '' }) => {
  const variantClass = variant !== 'default' ? `stamp-${variant}` : '';
  return (
    <span className={`stamp ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

export default Stamp;
