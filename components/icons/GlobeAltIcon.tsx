import React from 'react';

const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21l5.25-11.25L21 21m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12v-.008zm0 2.25h.008v.008H12v-.008zM3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5M12 3.75a8.25 8.25 0 00-8.25 8.25c0 6.213 6.073 9.75 8.25 9.75s8.25-3.537 8.25-9.75A8.25 8.25 0 0012 3.75z"
    />
  </svg>
);

export default GlobeAltIcon;
