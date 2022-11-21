import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
export function TopBar({ faAngleDown }) {
  return (
    <div className="top-bar">
      <div className="arigato">Arigato Massai</div>

      <FontAwesomeIcon className="angle" icon={faAngleDown} />
    </div>
  );
}
