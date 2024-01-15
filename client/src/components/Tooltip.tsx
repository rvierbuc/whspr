import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export const TooltipComponent = ({ id, tooltip, children }) => {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
      placement="top"
      delayShow={300}
      delayHide={150}
    >
      <div>{children}</div>
    </OverlayTrigger>
  );
};