import { useEventListener } from "@huddle01/react";
import { useVideo } from "@huddle01/react/hooks";
import React, { useRef } from "react";

const Stream: React.FC = () => {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const { stream } = useVideo();

  useEventListener("lobby:cam-on", () => {
    if (stream && videoRef.current) videoRef.current.srcObject = stream;
  });

  return <video ref={videoRef} autoPlay muted />;
};

export default Stream;
