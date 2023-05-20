import Init from "@/components/Main/Init";
import RoomPage from "@/components/Main/RoomPage";

import React, { useState } from "react";

const Home = () => {
  const [activeStage, setActiveStage] = useState<"init" | "room">("init");

  const stages: {
    [key: string]: JSX.Element;
  } = {
    init: <Init setActiveStage={setActiveStage} />,
    room: <RoomPage />,
  };

  return <>{activeStage ? stages[activeStage] : null}</>;
};

export default Home;
