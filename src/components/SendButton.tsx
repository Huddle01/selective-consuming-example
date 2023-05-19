import React from "react";

import { useMeetingMachine } from "@huddle01/react/hooks";

import Button from "./Button";

const SendButton = ({ event, disabled }: { event: any; disabled: boolean }) => {
  const { send } = useMeetingMachine();

  return (
    <div>
      <Button disabled={disabled} onClick={() => send(event)}>
        {event}
      </Button>
    </div>
  );
};

export default SendButton;
