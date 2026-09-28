import React from 'react';

const PageHeader = ({ label, title, subtitle, ornament = true }) => {
  return (
    <section className="page-header">
      <div className="container">
        {label && <span className="typewriter-label">{label}</span>}
        <h1>{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
        {ornament && (
          <div className="ornament-rule" aria-hidden="true">
            ❖ ❖ ❖
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
