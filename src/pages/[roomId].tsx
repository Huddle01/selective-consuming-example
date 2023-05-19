import { useDisplayName } from "@huddle01/react/app-utils";
import { useRouter } from "next/router";
import React from "react";

const RoomPage = () => {
  const { query } = useRouter();

  const { displayName } = useDisplayName();

  return (
    <div className="h-screen">
      {query.roomId} loll
      <div>{displayName}</div>
    </div>
  );
};

export default RoomPage;
