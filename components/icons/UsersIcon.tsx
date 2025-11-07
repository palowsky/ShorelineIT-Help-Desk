import React from 'react';

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.513-.96 1.487-1.591 2.571-1.82m-1.275 5.112a9.042 9.042 0 01-3.32 0M18 10.5a3 3 0 11-6 0 3 3 0 016 0zM12 15.75a9 9 0 002.548-1.681M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default UsersIcon;
